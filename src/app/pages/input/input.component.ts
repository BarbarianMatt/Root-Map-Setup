import { Component } from '@angular/core';
import { compressToEncodedURIComponent } from 'lz-string';

import { RootlogService } from '../../rootlog.service';
import { actualFactions,actualBots,actualClasses,actualHirelings, actualMaps} from '../../rootlog.static';
import { MapService } from '../../map.service';
import { LocalStorageService } from '../../local-storage.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  options=this.localGet(this.default());
  game = this.mapService.mapSetup(this.options);
  validRootlog = true;

  gameUrl = '';
  validRootlogUrl = false;
  constructor(private mapService: MapService, private rootlogService: RootlogService, private localStorageService: LocalStorageService ) {}
  localGet(options: any): any{
    const updated=options;
    for (const [key, value] of Object.entries(options)) {
      var element=this.localStorageService.getItem(key) as any;
      if (element !== null && element !== 'undefined' && element !== ''){
        updated[key]=element;
      }
    }
    return updated;
  }
  reset(): void {
    this.options=this.default();
    this.options.reset=false;
    this.gameChange();
  }
  True(): boolean {
    return true;
  }
  default(): any{
    var Default={
      'players': 4,
      'bots': 0,
      'extra': false,
      'reset': false,
      'hirelings': false,
      'balanced': false,
      'bannedFactions': this.getFactions(),
      'bannedBots': this.getBots(),
      'bannedClasses': this.getClasses(),
      'bannedHirelings': this.getHirelings(),
      'bannedMaps': this.getMaps(),
      'maxLandmarks': 2,
      'minLandmarks': 0,
      'epDeckOdds': 0.9,
    }
    return Default;
  }
  localSet(options: any): void{
    for (const [key, value] of Object.entries(options)) {
      this.localStorageService.setItem(key,value)
    }
    return;
  }

  gameChange(): void {
    this.localSet(this.options);
    this.game=this.mapService.mapSetup(this.options);
  }

  async gameUrlChange(): Promise<void> {
    try {
      const game = await this.rootlogService.getGameStringFromURLPromise(this.gameUrl);
      this.validRootlogUrl = this.rootlogService.isValidGame(game);
    } catch {
      this.validRootlogUrl = false;
    }
  }
  keys(obj:any): any[] {
    return Object.keys(obj);
  }
  getMaps(): any {
    var maps={} as any;
    for (const [key, value] of Object.entries(actualMaps)) {
      var element={} as any;
      element.banned=false;
      element.properName=value;
      maps[key]=element;
    }
    return maps;
  }
  getFactions(): any {
    var factions={} as any;
    for (const [key, value] of Object.entries(actualFactions)) {
      var element={} as any;
      element.name=value;
      element.banned=false;
      element.properName=this.rootlogService.getFactionProperName(key);
      factions[key]=element;
    }
    return factions;
  }
  getBots(): any {
    var factions={} as any;
    for (const [key, value] of Object.entries(actualBots)) {
      var element={} as any;
      element.name=value;
      element.banned=false;
      element.properName=this.rootlogService.getFactionProperName(key);
      factions[key]=element;
    }
    return factions;
  }
  getClasses(): any {
    var factions={} as any;
    for (const [key, value] of Object.entries(actualClasses)) {
      var element={} as any;
      element.name=value;
      element.banned=false;
      element.properName=this.rootlogService.getFactionProperName(key);
      factions[key]=element;
    }
    return factions;
  }
  all(type:string):void{
    var total=0;
    for (const [key, value] of Object.entries((this.options as any)[type]))
        total+=(this.options as any)[type][key].banned ? 1 : 0;
    var toggle=total<=Object.keys((this.options as any)[type]).length/2 ? true : false;
    for (const [key, value] of Object.entries((this.options as any)[type])) 
      (this.options as any)[type][key].banned=toggle;
    this.gameChange()
  }
  getHirelings(): any {
    var factions={} as any;
    for (const [key, value] of Object.entries(actualHirelings)) {
      var element={} as any;
      element.name=value;
      element.banned=false;
      element.properName=this.rootlogService.getFactionProperName(key).split(',')[0];
      factions[key]=element;
    }
    return factions;
  }

  getURLParams(): any {
    const base: any = {};
    if (this.game) { base.game = this.getEncodedGame(); }
    if (this.gameUrl) { base.gameUrl = this.gameUrl; }

    return base;
  }

  getEncodedGame(): string {
    if (!this.game) { return ''; }
    return compressToEncodedURIComponent(this.game);
  }

}
