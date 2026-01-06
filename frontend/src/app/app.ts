import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Landing } from "./landing/landing";
import { Home } from "./home/home";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Landing, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
