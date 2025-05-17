import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @ViewChild("menuNAV") menuNAV!: ElementRef;
  delay():void {
    setTimeout(() => {
      this.toggleMenu();
    }, 300);
  }
  toggleMenu(): void {
    this.menuNAV.nativeElement.classList.toggle("open");
  }
}