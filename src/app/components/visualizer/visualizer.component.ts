import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RootFaction, RootGame, RootMap, RootSuit } from '@seiyria/rootlog-parser';
import { interval } from 'rxjs';
import { RootlogService } from '../../rootlog.service';
import { FormattedAction, RootClearing, RootGameState, change, actualFactions,actualClasses, outsidersFactions } from '../../rootlog.static';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent implements OnInit {

  @Input() game!: RootGame;
  @Input() startAction!: number;
  @Input() startClearing!: number;

  @Output() actionChange = new EventEmitter();
  @Output() clearingChange = new EventEmitter();

  public map!: RootMap;
  public currentAction = 0;
  public currentClearing = -1;
  public allActions: FormattedAction[] = [];

  public get action(): FormattedAction {
    return this.allActions[this.currentAction];
  }

  public get state(): RootGameState | undefined {
    return this.action.currentState;
  }

  public get clearing(): RootClearing {
    return this.state?.clearings[this.currentClearing] as RootClearing;
  }

  public autoPlay = false;

  constructor(
    public rootlogService: RootlogService
  ) { }
  trackByBuilding(index: number, building: any): string {
    return building.name; // Replace 'id' with the unique identifier property of the building object
  }
  trackByPlayer(index: number, player: any): string {
    return player.key; // Replace 'key' with the unique identifier property of the player object
  }
  ngOnInit(): void {
    this.allActions = this.rootlogService.getAllActions(this.game);
    this.currentAction=this.allActions.length-1;
    this.watchKeybinds();
    this.autoplayLoop();
    if (this.startAction) {
      this.setAction(this.startAction);
    }

    if (this.startClearing) {
      this.showClearingInfo(this.startClearing);
    }
  }

  setAction(act: number): void {
    if (act < 0 || act > this.allActions.length - 1) { return; }
    this.currentAction = act;

    this.actionChange.next(act);
  }

  isActiveTurn(faction: RootFaction|string): boolean {
    return this.action.currentTurn === faction;
  }

  prevTurn(): void {
    let changed = false;

    for (let i = this.currentAction - 1; i >= 0; i--) {
      const checkAct = this.allActions[i];

      if (checkAct.changeTurn) {
        this.setAction(i);
        changed = true;
        break;
      }
    }

    if (!changed) { this.setAction(0); }
  }

  nextTurn(): void {
    let changed = false;

    for (let i = this.currentAction + 1; i < this.allActions.length; i++) {
      const checkAct = this.allActions[i];

      if (checkAct.changeTurn) {
        this.setAction(i);
        changed = true;
        break;
      }
    }

    if (!changed) { this.setAction(this.allActions.length - 1); }
  }

  toggleAutoplay(): void {
    this.autoPlay = !this.autoPlay;
  }

  getCurrentVP(factionKey: string): number {
    return this.action.currentState?.factionVP[factionKey as RootFaction] ?? 0;
  }

  showClearingInfo(idx: number): void {
    this.currentClearing = idx;

    this.clearingChange.next(idx);
  }

  isPositive(num: number | undefined): boolean {
    return (num || 0) > 0;
  }

  clearingHasWarriors(clearing: RootClearing): boolean {
    return Object.keys(clearing.warriors).some(w => (clearing.warriors[w as RootFaction] || 0) !== 0);
  }

  clearingHasBuildings(clearing: RootClearing): boolean {
    return Object.keys(clearing.buildings).some(b => (clearing.buildings[b] || 0) !== 0);
  }

  clearingHasTokens(clearing: RootClearing): boolean {
    //return Object.keys(clearing.tokens).some(t => (clearing.tokens[t] || 0) !== 0);
    return this.getTokens(clearing).length>0;
  }
  clearingHasLandmarks(clearing: RootClearing): boolean {
    return this.getLandmarks(clearing).length>0;
  }

  private getCardboard(record: Partial<Record<string, number>>): any[] {
    const resultCardboard: any[] = [];
    const uniqueCardboard = Object.keys(record);
    uniqueCardboard.forEach(cardboard => {
      const limit = Math.abs(record[cardboard] || 0);
      const isNegative = (record[cardboard] || 0) < 0;
      for (let i = 0; i < limit; i += 1) {
        resultCardboard.push({
          name: cardboard,
          isNegative
        });
      }
    });
    return resultCardboard;
  }

  getBuildings(clearing: RootClearing): any[] {
    //return this.getCardboard(clearing.buildings);
    var notAllowed=['m_b_f','m_b_b','m_b_c','m_b_m']
    var tokens = JSON.parse(JSON.stringify(clearing.buildings));
    const filtered = Object.keys(tokens)
    .filter(key => !notAllowed.includes(key))
    .reduce((obj, key) => {
    (obj as any)[key] = tokens[key];
    return obj;
    }, {});
    return this.getCardboard(filtered);
  }
  getBuildingName(building: any, clearing: any): string {
    if (building.name == 'm_b' && clearing.buildings['m_b_f'])
      return 'm_b_f';
    if (building.name == 'm_b_r' && clearing.buildings['m_b_b'])
      return 'm_b_b';
    if (building.name == 'm_b_s' && clearing.buildings['m_b_c'])
      return 'm_b_c';
    if (building.name == 'm_b_w' && clearing.buildings['m_b_m'])
      return 'm_b_m';
    return building.name;
  }

  replaceCave(name: any,game:RootGame): string {
    var players = Object.keys(JSON.parse(JSON.stringify(game.players)));
    if ((name == 'm_b' || name == 'm_b_r' || name == 'm_b_s' || name == 'm_b_w') && players.includes('W'))
      return 'cave';
    return name;
  }

  getTokens(clearing: RootClearing): any {
    //return this.getCardboard(clearing.tokens);
    var tokens = JSON.parse(JSON.stringify(clearing.tokens));
    const filtered = Object.keys(tokens)
    .filter(key => !key.startsWith('m') && (!key.startsWith('k') || (<any>this.state).displayRelics))
    .reduce((obj, key) => {
    (obj as any)[key] = tokens[key];
    return obj;
    }, {});
    return this.getCardboard(filtered);
  }
  getLandmarks(clearing: RootClearing): any[] {
    var tokens = JSON.parse(JSON.stringify(clearing.tokens));
    const filtered = Object.keys(tokens)
    .filter(key => key.startsWith('m'))
    .reduce((obj, key) => {
    (obj as any)[key] = tokens[key];
    return obj;
    }, {});
    return this.getCardboard(filtered);
  }
  getWarriors(clearing: RootClearing): any[]{
    //console.log(clearing.warriors);
    return this.getCardboard(clearing.warriors);
  }
  filterZeros(clearing: any): any[]{
    Object.entries(clearing).forEach(([k, v]) => {
      if (v === 0) delete clearing[k];
    });
    return clearing;
  }
  getPlayers(game: RootGame): KeyValue<RootFaction, string>[] {
    //var allowed= ['M','P','L','D','E','C','O','V','A','G','K','H','Ạ','Å','Ä','Ả','Ḁ','Ấ','Ầ','Ẩ','Ȃ','B'];

    var allowed = Object.keys(actualFactions).concat(Object.keys(actualClasses)).concat(Object.keys(outsidersFactions)).concat('M');
    var players =  JSON.parse(JSON.stringify(game.players));
    Object.keys(players).filter(key => !allowed.includes(key)).forEach(key => delete players[key]);
    const numPlayers = Object.values(players).length;
    const firstRound = game.turns.slice(numPlayers, numPlayers * 2).map(turn => turn.taker as string);
    const sortedPlayers = Object.keys(players).sort((player1, player2) => {
      const indexOfPlayer1 = firstRound.indexOf(player1);
      const indexOfPlayer2 = firstRound.indexOf(player2);
      return indexOfPlayer1 - indexOfPlayer2;
    }).map(player => {
      const faction = player as RootFaction;
      return {
        key: faction,
        value: players[faction] || ''
      };
    });
    return sortedPlayers;
  }
  getHirelings(game: RootGame): KeyValue<RootFaction, string>[] {
    var allowed=  [change('P'),change('L'),change('D'),change('E'),change('C'),change('O'),change('V'),change('A'),change('K'),change('H'),change('B'),change('R'),change('N')];
    var players =  JSON.parse(JSON.stringify(game.players));
    Object.keys(players).filter(key => !allowed.includes(key)).forEach(key => delete players[key]);
    const numPlayers = Object.values(players).length;
    const sortedPlayers = Object.keys(players).map(player => {
      const faction = player as RootFaction;
      return {
        key: faction,
        value: players[faction] || ''
      };
    });
    return sortedPlayers;
  }
  getBots(game: RootGame): KeyValue<RootFaction, string>[] {
    var allowed=  ['c','e','a','v','d','p','l','o','å','ả','ấ','ầ','ẩ','ȃ'];
    var players =  JSON.parse(JSON.stringify(game.players));
    Object.keys(players).filter(key => !allowed.includes(key)).forEach(key => delete players[key]);

    const numPlayers = Object.values(players).length;
    const firstRound = game.turns.slice(numPlayers, numPlayers * 2).map(turn => turn.taker as string);
    const sortedPlayers = Object.keys(players).sort((player1, player2) => {
      const indexOfPlayer1 = firstRound.indexOf(player1);
      const indexOfPlayer2 = firstRound.indexOf(player2);
      return indexOfPlayer1 - indexOfPlayer2;
    }).map(player => {
      const faction = player as RootFaction;
      return {
        key: faction,
        value: players[faction] || ''
      };
    });

    return sortedPlayers;
  }

  clearingHasErrors(clearingIndex: number, state: RootGameState, suit?: RootSuit): boolean {
    const clearing = state.clearings[clearingIndex];
    if (!clearing) {
      return false;
    }
    // Error on...

    // Negative number of pieces.
    if (Object.values(clearing.warriors).some(numWarriors => (numWarriors || 0) < 0) ||
        Object.values(clearing.buildings).some(numBuildings => (numBuildings || 0) < 0) ||
        Object.values(clearing.tokens).some(numTokens => (numTokens || 0) < 0)) {
      return true;
    }

    // More than 3 buildings.
    const buildings = Object.keys(clearing.buildings)
    .filter(key => !key.startsWith('m'))
    .reduce((obj, key) => {
    (obj as any)[key] = clearing.buildings[key];
    return obj;
    }, {});
    const totalBuildings = Object.values(buildings).reduce((a, b) => {
      return ((a as any) || 0) + (b || 0);
    }, 0) || 0;
    if ((totalBuildings as any) > (3+(clearing.tokens.m_t_r ? 1 : 0))) {
      return true;
    }

    // More than one sympathy token.
    if ((clearing.tokens.a_t || 0) > 1) {
      return true;
    }

    // More than one trade post.
    if ((clearing.tokens.o_t_f || 0) +
        (clearing.tokens.o_t_r || 0) +
        (clearing.tokens.o_t_m || 0) > 1) {
      return true;
    }

    // More than one plot token.
    if ((clearing.tokens.p_t || 0) +
        (clearing.tokens.p_t_e || 0) +
        (clearing.tokens.p_t_r || 0) +
        (clearing.tokens.p_t_s || 0) +
        (clearing.tokens.p_t_b || 0) > 1) {
      return true;
    }

    // More than one Eyrie roost.
    if ((clearing.buildings.e_b || 0) > 1) {
      return true;
    }

    // More than one alliance base building.
    if ((clearing.buildings.a_b_f || 0) +
        (clearing.buildings.a_b_r || 0) +
        (clearing.buildings.a_b_m || 0) > 1) {
      return true;
    }

    // Error when trade post, garden, or base doesn't match the suit
    // in Fox clearings.
    if (suit !== RootSuit.Fox && (
      (clearing.buildings.a_b_f || 0) +
      (clearing.buildings.l_b_f || 0) +
      (clearing.tokens.o_t_f || 0) > 0
    )) {
      return true;
    }
    if (suit !== RootSuit.Rabbit && (
      (clearing.buildings.a_b_r || 0) +
      (clearing.buildings.l_b_r || 0) +
      (clearing.tokens.o_t_r || 0) > 0
    )) {
      return true;
    }
    if (suit !== RootSuit.Mouse && (
      (clearing.buildings.a_b_m || 0) +
      (clearing.buildings.l_b_m || 0) +
      (clearing.tokens.o_t_m || 0) > 0
    )) {
      return true;
    }

    return false;
  }

  private watchKeybinds(): void {
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') {
        this.setAction(this.currentAction - 1);
        return false;
      }

      if (e.key === 'ArrowRight') {
        this.setAction(this.currentAction + 1);
        return false;
      }

      return;
    });
  }

  private autoplayLoop(): void {
    interval(500).subscribe(() => {
      if (!this.autoPlay) { return; }

      this.setAction(this.currentAction + 1);
    });
  }

}
