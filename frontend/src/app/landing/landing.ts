import { Component, HostListener } from '@angular/core';
import { NgStyle } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-landing',
  imports: [NgStyle, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  isScrolled = false;
  year:number = new Date().getFullYear()
  month:string = new Date().toLocaleString('default',{month:'long'})

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 30;
  }
  get navStyle() {
    return {
      backgroundColor: this.isScrolled
        ? '#FFA00030'
        : 'transparent',
      backdropFilter: this.isScrolled
        ? 'blur(10px)'
        : 'none',
    };
  }
}
