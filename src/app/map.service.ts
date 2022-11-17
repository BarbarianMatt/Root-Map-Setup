
import { Injectable } from '@angular/core';
import { RootFaction, RootGame, RootMap, RootSuit} from '@seiyria/rootlog-parser';
import * as _ from 'lodash';
import { RootlogService} from  './rootlog.service';
import { mapData, RootClearing, forestPositions, pathPositions, change, factionTraits} from  './rootlog.static';

function choose(array: Array<any>, n: number) {
    var shuffled=shuffle(array);
    return shuffled.slice(0, n);
}
function out(output: string,str: string) {
    output=output + str + '\r\n';
    return output;
}
function shuffle(array: Array<any>) {
    if (array == undefined)
        console.trace();
    return array.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
function space(start:number, len:number){
    return Array.from({length: len}, (_, i) => i + start);
}
function boxMullerTransform() {
    const u1 = Math.random();
    const u2 = Math.random();
    
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
    
    return { z0, z1 };
}
function getNormallyDistributedRandomNumber(mean: number, stddev: number) {
    const { z0, z1 } = boxMullerTransform();
    
    return z0 * stddev + mean;
}
function validLandmark(landmark: string, clearing: number, used: Array<number>, map: RootMap){
    var clearingData=mapData[map][clearing];
    if (used.includes(clearing)){
        return false;
    }
    if (landmark!='t' && used.some(item => clearingData["adjacent"].includes(item))){
        return false;
    }
    if (landmark == 't' && !(clearingData["ruins"])){
        return false;
    }
    else if (landmark == "t_m" && !(clearingData["slots"]==1 && !clearingData["ruins"]))
        return false;
    else if (landmark == "t_c" && !(clearingData["river"]))
        return false;
    else if (landmark == "t_f" && !(clearingData["river"]))
        return false;
    else if (landmark == "t_r" && !(!clearingData["edge"] && clearingData["adjacent"].length>2)){
        return false;
    }
        
    return true;
}
function clone(obj: any){
    return JSON.parse(JSON.stringify(obj));
}
function validFactionPool(factionChoices: Array<string>,players: number){
    //adventurer,arbiter,harrier,ranger,ronin,scoundrel,thief,tinker,vagrant
    var vagabondClasses = ['Ạ','Å','Ä','Ả','Ḁ','Ấ','Ầ','Ẩ','Ȃ'];
    var fac =[];
    var factions = clone(factionChoices);
    for (var i=0; i<Math.max(players+1,3);i++) {
        var f=choose(factions,1)[0];
        fac.push(f);
        factions.splice(factions.indexOf(f),1);

        if (f == 'V'){
            factions.push('G');
            var v = choose(vagabondClasses,1)[0]
            fac.push(v);
            vagabondClasses.splice(vagabondClasses.indexOf(v),1);
        }
        else if (f == 'G'){
            var v = choose(vagabondClasses,1)[0]
            fac.push(v);
            vagabondClasses.splice(vagabondClasses.indexOf(v),1);
        }
    }
    return fac;
}
function remove(array: Array<any>, element: any){
    if (array.includes(element))
        array.splice(array.indexOf(element),1)
    return;
}
@Injectable({
  providedIn: 'root'
})

export class MapService {
    constructor(private rootlogService: RootlogService) {}
    public mapSetup(players: number, bots: number, h: boolean, balanced: boolean): string {
        var output=''
        // randomly select map
        var maps = [RootMap.Fall, RootMap.Winter, RootMap.Lake, RootMap.Mountain];
        //var maps = [RootMap.Fall];
        const map= choose(maps,1)[0] as RootMap;
        output=out(output,"Map: " + map);

        // randomly select deck
        var deck=Math.random()<=0.9 ? 'E&P' : 'Standard';
        output=out(output,"Deck: " + deck);

        // randomly select suits
        var suits=['R', 'R', 'R', 'R', 'F', 'F', 'F', 'F', 'M', 'M', 'M', 'M'];
        suits = shuffle(suits);
        var loop=true;
        while (balanced && loop){
            suits = shuffle(suits);
            loop=false
            for (var i=0; i<suits.length;i++){
                var nextDoor=mapData[map][i+1].adjacent as Array<number>;
                if (map == RootMap.Mountain)
                    nextDoor=nextDoor.concat(mapData[map][i+1].closedAdjacent)
                if (nextDoor.some(val=>suits[val-1]==suits[i])){
                    loop = true
                    break
                }
            }
        }
        var clearings = 'Clearings: ' + suits[0] + '1';
        for (var i = 1; i < suits.length; i++) 
            clearings+=', ' + suits[i]+ (i+1).toString();
        output=out(output,clearings);

        var temp=''
        output=out(output,"M: "+deck+' Deck');
        // randomly select landmarks
        //swrkfrmcbe is which prefexes you are allowed to use
        // tower, marker, city, ferry, forge, treetop
        var landmarks = ["t","t_m","t_c","t_f",'t_k','t_r'];
        var maxLandmarks=2;
        var minLandmarks=0;
        var mean = (maxLandmarks+minLandmarks)/2
        var numl=Math.round(Math.max(Math.min(getNormallyDistributedRandomNumber(mean+0.1,mean*0.557),maxLandmarks),minLandmarks));
        var land = choose(landmarks,numl);
        var r = Math.random();
        if ((map=='Mountain' && r<0.4 && !land.includes('t')) || (map == 'Lake' && r<0.4 && !land.includes('t_f')))
            land[0] = map == 'Mountain' ? 't' : 't_f';
        
        var found = false;
        var landmarkClearings=[];
        var loops1=0
        while (!found && loops1<=100000) {
            landmarkClearings=[];
            found = true;
            land=shuffle(land);
            var clears=choose(space(1,12),land.length);
            for (var i=0;i<land.length;i++){
                var clearing=clears[i];
                var r = Math.random();
                if (map == 'Mountain' && r<0.2)
                    clearing=10;
                if (!validLandmark(land[i],clearing,landmarkClearings,map)){
                    found=false;
                }
                landmarkClearings.push(clearing);
            }
            loops1+=1;
        }
        if (loops1>=100000){
            console.log("looped too much");
        }
        //avaiable subnames for pieces are swrkfmcbe
        var ruinClears = space(1,12).filter(val => mapData[map][val]["ruins"])
        var ruinItems=['b','b_s','b_w','b_r']
        var str='M:';
        if (ruinClears.length>0){
            str+=ruinItems[0]+'->'+ruinClears[0]+'/'
            for (var i=1; i<ruinClears.length;i++)
                str+=ruinItems[i]+'->'+ruinClears[i]+'/';
        }
        if (land.length>0){
            
            for (var i=0;i<landmarkClearings.length;i++){
                str+=land[i]+'->'+landmarkClearings[i].toString()+'/';
                if (land[i] == 't_c')
                    suits[landmarkClearings[i]-1]=suits[landmarkClearings[i]-1]+'FRM'.replace(suits[landmarkClearings[i]-1],'');
                else if (land[i] == 't_r'){
                    mapData[map][landmarkClearings[i]]["slots"]=mapData[map][landmarkClearings[i]]["slots"]+1;
                }
                else if (land[i] == 't_k'){
                    if (suits[landmarkClearings[i]-1].includes('F'))
                        str+='Z%s/Z%s/Z%x/Z%h/'
                    if (suits[landmarkClearings[i]-1].includes('R'))
                        str+='Z%b/Z%b/Z%t/Z%t/'
                    if (suits[landmarkClearings[i]-1].includes('M'))
                        str+='Z%f/Z%f/Z%c/Z%c/'
                }
            }
            str=str.slice(0,-1);
            temp=out(temp,str);
        }

        // variables
        var factions=['P','L','D','E','C','O','V','A','K','H'];
        var bot=['c','e','a','v','p','d','o','l'];
        var vagabondBotClasses = ['å','ả','ấ','ầ','ẩ','ȃ'];

        // randomly select bots
        var botsList = choose(bot,bots);
        botsList.push('c');
        for (var i=0; i<botsList.length;i++) {
            remove(factions, botsList[i].toUpperCase());
            if (botsList[i]=='v')
                botsList.splice(i+1,0,choose(vagabondBotClasses,1)[0])
            var str=botsList[i]+": "+this.rootlogService.getFactionProperName(botsList[i]);
            if (bot.includes(botsList[i]))
                str +=' ('+choose(factionTraits[botsList[i].toUpperCase() as RootFaction],1)+')'
            output=out(output,str);
        }
        
        //setup bots
        var corners=space(1,12).filter(val => mapData[map][val]["corner"]);
        var keep=0;
        
        if (botsList.includes('c')){
            var buildings=shuffle(['b_s','b_r','b_w']);
            var corner = choose(corners,1)[0];
            corners.splice(corners.indexOf(corner),1);
            keep=corner;
            var str="c:t_k->"+corner.toString()+'/w->'+corner.toString();
            for (var i=1;i<13;i++){
                if (mapData[map][corner]["opposite"]!=i)
                    str+='+'+i.toString();
            }
            var adjacent=mapData[map][corner]["adjacent"];
            if (adjacent.length<buildings.length)
                adjacent = adjacent.concat(Array(buildings.length-adjacent.length).fill(corner));
            for (var i=0;i<buildings.length;i++){
                str+='/'+buildings[i]+'->'+adjacent[i].toString();
                mapData[map][adjacent[i]]["slots"]=mapData[map][adjacent[i]]["slots"]-1;
            }
            temp=out(temp,str);
        }
        if (botsList.includes('e')){
            var corner = corners.length==3 ? mapData[map][space(1,12).filter(val => mapData[map][val]["corner"] && !corners.includes(val))[0]]["opposite"] : choose(corners,1)[0];
            corners.splice(corners.indexOf(corner),1);
            mapData[map][corner]["slots"]=mapData[map][corner]["slots"]-1;
            temp=out(temp,'e:b+6w->'+corner.toString());
        }
        if (botsList.includes('v')){
            var size=Object.keys(forestPositions[map]).reduce((r,s) => r > (s.match(/\_/g) || []).length ? r : (s.match(/\_/g) || []).length, 0);
            var largestForests = Object.keys(forestPositions[map]).filter(pl => (pl.match(/\_/g) || []).length == size);
            temp=out(temp,'v:p->'+choose(largestForests,1)[0].toString());
        }
        if (botsList.includes('l')){
            var corner = corners.length==3 ? mapData[map][space(1,12).filter(val => mapData[map][val]["corner"] && !corners.includes(val))[0]]["opposite"] : choose(corners,1)[0];
            corners.splice(corners.indexOf(corner),1);
            var str='l:4w+b_'+(suits[corner-1].toString()[0].toLowerCase())+'->'+corner.toString();
            for (var i=0;i<mapData[map][corner]["adjacent"].length;i++)
                str+='/w->'+mapData[map][corner]["adjacent"][i].toString();
            mapData[map][corner]["slots"]=mapData[map][corner]["slots"]-1;
            temp=out(temp,str);
        }
        if (botsList.includes('o')){
            var cleas=space(1,12).filter(val => mapData[map][val]["river"] && val!=keep);
            var str='o:w->'+cleas[0];
            for (var i=1;i<cleas.length;i++)
                str+='+'+cleas[i];
            temp=out(temp,str);
        }
        if (botsList.includes('d')){
            var corner = corners.length==3 ? mapData[map][space(1,12).filter(val => mapData[map][val]["corner"] && !corners.includes(val))[0]]["opposite"] : choose(corners,1)[0];
            corners.splice(corners.indexOf(corner),1);
            var str='d:t->'+corner.toString()+'/2w->'+corner.toString();
            for (var i=0;i<mapData[map][corner]["adjacent"].length;i++)
                str+='+'+mapData[map][corner]["adjacent"][i].toString();
            temp=out(temp,str);
        }
        if (botsList.includes('p')){
            var str='p:w->';
            str+=space(1,12).filter(val => suits[val-1].includes('F') && val!=keep).splice(-1)[0]+'+';
            str+=space(1,12).filter(val => suits[val-1].includes('M') && val!=keep).splice(-1)[0]+'+';
            str+=space(1,12).filter(val => suits[val-1].includes('R') && val!=keep).splice(-1)[0];
            temp=out(temp,str);
        }

        // randomly select hirelings
        // band, bandits, dynasty, exile, expedition, flamebearers, flotilla, patrol, prophets, protector, spies, uprising, vaultkeepers
        var noneTypeHirelings=['B','N','R'];
        var hirelings = choose(factions.concat(noneTypeHirelings), (h ? 3: 0));
        hirelings[0]='K';
        for (var i=0; i<hirelings.length;i++){
            var hire=hirelings[i];
            if (factions.includes(hire) && (factions.length- (hire == 'V' ? 2 : 1))<players+1)
                hire=choose(['B','N','R'].filter(val=>!hirelings.includes(val) && !hirelings.includes(val+'\u0301')),1)[0];   
            remove(factions,hire);
            hirelings[i]=change(hire);
            output=out(output,hirelings[i]+": "+this.rootlogService.getFactionProperName(hirelings[i]).split(',')[i+players+bots>4 ? 1 : 0]+ ' '+ (i+players+bots>4 ? '▼' : '▲'));
        }

        // setup hirelings
        for (var i=0; i<hirelings.length && i<5-players-bots; i++){
            var hireling=hirelings[i];
            if (hireling == change('K')){
                var clear = choose(space(1,12).filter(val => mapData[map][val]["slots"]>0 && val!=keep),1)[0];
                temp=out(temp,change('K')+':b+2w->'+clear.toString());
                mapData[map][clear]["slots"]=mapData[map][clear]["slots"]-1;
            }
            if (hireling == change('B')){
                //var clears = choose(space(1,12).filter(val => val!=keep),2);
                var clears = choose(space(1,12).filter(val => val!=keep),2);
                temp=out(temp,change('B')+':w->'+clears[0].toString()+'+'+clears[1].toString());
            }
            if (hireling == change('N')){
                var clears=choose(Object.keys(pathPositions[map]),2);
                //var clears=choose(Object.keys(pathPositions[map]),Object.keys(pathPositions[map]).length);
                var str='';
                if (clears.length>0){
                    str+=change('N')+':w->'+clears[0];
                    for (var j=1; j<clears.length; j++)
                        str+='+'+clears[j]
                }
                temp=out(temp,str);
            }
            if (hireling == change('P')){
                var suit = choose(['R','F','M'],1)[0];
                var clears = choose(space(1,12).filter(val => suits[val-1].includes(suit) && val!=keep),2);
                temp=out(temp,change('P')+':w->'+clears[0].toString()+'+'+clears[1].toString());
            }
            if (hireling == change('L')){
                var cleas = space(1,12).filter(val => mapData[map][val]["ruins"] && val!=keep);
                var str='';
                if (cleas.length>0)
                    str+=change('L')+':w->'+cleas[0];
                    for (var j=1; j<cleas.length; j++)
                        str+='+'+cleas[j]
                temp=out(temp,str);
            }
            if (hireling == change('D')){
                var clear = choose(space(1,12).filter(val => val!=keep),1)[0];
                temp=out(temp,change('D')+':t+3w->'+clear.toString());
            }
            if (hireling == change('E')){
                var clear = choose(space(1,12).filter(val => mapData[map][val]["edge"] && val!=keep),1)[0];
                temp=out(temp,change('E')+':5w->'+clear.toString());
            }
            if (hireling == change('C')){
                var cleas = space(1,12).filter(val => val!=keep);
                var str='';
                if (cleas.length>0){
                    str+=change('C')+':w->'+cleas[0];
                    for (var j=1; j<cleas.length; j++)
                        str+='+'+cleas[j]
                }
                temp=out(temp,str);
            }
            if (hireling == change('R')){
                var clear = choose(space(1,12).filter(val => val!=keep),1)[0];
                temp=out(temp,change('R')+':w->'+clear.toString());
            }
            if (hireling == change('H')){
                var clear1 = choose(space(1,12).filter(val => val!=keep),1)[0];
                var clear2 = choose(space(1,12).filter(val => val!=keep),1)[0];
                temp=out(temp,change('H')+':w->'+clear1.toString()+'+'+clear2.toString());
            }
            if (hireling == change('O')){
                var clears = choose(space(1,12).filter(val => mapData[map][val]["edge"] && mapData[map][val]["river"] && val!=keep),1);
                if (clears.length==0)
                    clears = choose(space(1,12).filter(val => mapData[map][val]["river"] && val!=keep),1)
                var clear=clears[0];
                temp=out(temp,change('O')+':w->'+clear.toString());
            }
            if (hireling == change('V')){
                var clear=choose(Object.keys(forestPositions[map]),1)[0];
                temp=out(temp,change('V')+':w->'+clear.toString());
            }
            if (hireling == change('A')){
                var suit1 = choose(['R','F','M'],1)[0];
                var suit2 = choose(['R','F','M'],1)[0];
                var clear1 = choose(space(1,12).filter(val => suits[val-1].includes(suit1) && val!=keep),1)[0];
                var clear2 = choose(space(1,12).filter(val => suits[val-1].includes(suit2) && val!=keep),1)[0];
                temp=out(temp,change('A')+':w->'+clear1.toString()+'+'+clear2.toString());
            }

        }

        // randomly select factions
        var militant = ['D','E','C','K','H'];
        var valid = false;
        var loops2 =0
        var pool=militant;
        while (!valid && loops2<=100000){
            valid = true;
            pool=validFactionPool(factions,players);
            var totalMilitant = (militant.filter(value => pool.includes(value) || botsList.includes(value.toLowerCase()))).length;
            if (totalMilitant<1 || (players==2 && totalMilitant<3))
                valid = false
            loops2+=1;
        }
        if (loops2>=100000)
            console.log('looped too much')
        var totalMilitant = (militant.filter(value => pool.includes(value) || botsList.includes(value.toLowerCase()))).length;
        for (var i=0; i<pool.length;i++) {
            var str=pool[i]+": "+this.rootlogService.getFactionProperName(pool[i]);
            if ((i==pool.length-1 && totalMilitant<=1 &&  !militant.includes(pool[i]) && !['Ạ','Å','Ä','Ả','Ḁ','Ấ','Ầ','Ẩ','Ȃ'].includes(pool[i]))
            || (i==pool.length-2 && totalMilitant<=1 && (pool[i] == 'V' || pool[i] == 'G')) )
                str+=' 🔒'
            if (pool[i]=='K'){
                var relics = ['t','t','t','t','t_k','t_k','t_k','t_k','t_m','t_m','t_m','t_m']
                var forests = Object.keys(forestPositions[map]);
                var clears=choose(relics,forests.length);
                var st='';
                if (clears.length>0){
                    st+='K:'+clears[0]+'->'+forests[0];
                    for (var j=1; j<clears.length; j++)
                        st+='/'+clears[j]+'->'+forests[j];
                }
                temp=out(temp,st);
            }
            output=out(output,str);
        }
        output+=temp;
        if (loops1>=100000 || loops2>=100000)
            output='error';
        output='Map: Winter\r\n\r\nDeck: Standard\r\n\r\nClearings: F1, M2, M3, M4, F5, R6, F7, R8, F9, R10, M11, R12\r\n\r\nM: Standard Deck\r\n\r\nc: Mechanical Marquise 2.0 (Iron will)\r\n\r\nē: Vault Keepers ▲\r\n\r\nė: Riverfolk Flotilla ▲\r\n\r\nĐ: Flame Bearers ▲\r\n\r\nP: Corvid Conspiracy\r\n\r\nD: Underground Duchy\r\n\r\nV: Vagabond\r\n\r\nẢ: Ranger\r\n\r\nM:b->8/b_s->9/b_w->11/b_r->12/t_f->7/t_c->12\r\n\r\nc:t_k->2/w->2+1+2+3+5+6+7+8+9+10+11+12/b_r->6/b_s->7/b_w->12\r\n\r\nē:b+2w->12\r\n\r\nė:w->10\r\n\r\nĐ:w->1+4\r\n'
        console.log(output);
        return output;
    }
}