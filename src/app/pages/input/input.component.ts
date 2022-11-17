import { Component } from '@angular/core';
import { compressToEncodedURIComponent } from 'lz-string';

import { RootlogService } from '../../rootlog.service';
import { MapService } from '../../map.service';
import { LocalStorageService } from '../../local-storage.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {

  players=this.localStorageService.getItem('players') == null ? '4' : this.localStorageService.getItem('players');
  bots=this.localStorageService.getItem('bots') == null ? '0' : this.localStorageService.getItem('bots');
  hirelings=this.localStorageService.getItem('hirelings') == null ? false: JSON.parse(this.localStorageService.getItem('hirelings')!.toLowerCase());
  balanced = this.localStorageService.getItem('balanced') == null ? false: JSON.parse(this.localStorageService.getItem('balanced')!.toLowerCase());
  game = this.mapService.mapSetup(parseInt(this.players!),parseInt(this.bots!),this.hirelings, this.balanced);
  validRootlog = true;

  gameUrl = '';
  validRootlogUrl = false;
  constructor(private mapService: MapService, private rootlogService: RootlogService, private localStorageService: LocalStorageService ) {}

  gameChange(): void {
    this.localStorageService.setItem('players',this.players);
    this.localStorageService.setItem('bots',this.bots);
    this.localStorageService.setItem('hirelings',this.hirelings);
    this.localStorageService.setItem('balanced',this.balanced);
    this.game=this.mapService.mapSetup(parseInt(this.players!),parseInt(this.bots!),this.hirelings, this.balanced);
  }

  async gameUrlChange(): Promise<void> {
    try {
      const game = await this.rootlogService.getGameStringFromURLPromise(this.gameUrl);
      this.validRootlogUrl = this.rootlogService.isValidGame(game);
    } catch {
      this.validRootlogUrl = false;
    }
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
