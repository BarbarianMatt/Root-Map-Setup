import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { decompressFromEncodedURIComponent } from 'lz-string';

import { RootGame } from '@seiyria/rootlog-parser';
import { RootlogService } from '../../rootlog.service';

@Component({
  selector: 'app-full-game',
  templateUrl: './full-game.component.html',
  styleUrls: ['./full-game.component.scss']
})
export class FullGameComponent implements OnInit {

  public game?: RootGame;
  public startAction = 0;
  public startClearing = -1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public rootlogService: RootlogService
  ) { }

  async ngOnInit(): Promise<void> {
    this.startAction = +(this.route.snapshot.queryParamMap.get('action') || '0');
    this.startClearing = +(this.route.snapshot.queryParamMap.get('clearing') || '-1');

    const game = decompressFromEncodedURIComponent(this.route.snapshot.queryParamMap.get('game') || '') || '';
    const gameUrl = this.route.snapshot.queryParamMap.get('gameUrl') || '';

    if (game) {
      if (!this.rootlogService.isValidGame(game)) {
        this.router.navigate(['/input-game']);
        return;
      }

      this.game = this.rootlogService.game(game);
    }

    if (gameUrl) {
      this.rootlogService.getGameStringFromURL(gameUrl)
        .subscribe(urldGame => {
          if (!this.rootlogService.isValidGame(urldGame)) {
            this.router.navigate(['/input-game']);
            return;
          }

          this.game = this.rootlogService.game(urldGame);
        });
    }
  }

  actionChange(num: number): void {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { action: num },
        queryParamsHandling: 'merge'
      });
  }

  clearingChange(num: number): void {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { clearing: num },
        queryParamsHandling: 'merge'
      });
  }

}
