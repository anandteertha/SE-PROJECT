import { Component, EventEmitter, OnInit, OnDestroy, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss'
})
export class SearchBar implements OnInit, OnDestroy {
  @Output() searchChange = new EventEmitter<string>();
  
  searchQuery: string = '';
  displayText: string = '';
  isFocused: boolean = false;
  
  private placeholders: string[] = [
    'Search for quinoa bowls...',
    'Find your favorite salad...',
    'Looking for vegan options?',
    'Try our smoothie bowls...',
    'Search healthy meals...'
  ];
  
  private currentIndex: number = 0;
  private charIndex: number = 0;
  private isDeleting: boolean = false;
  private typingSpeed: number = 150;
  private deletingSpeed: number = 100;
  private pauseTime: number = 2000;
  private typingInterval: ReturnType<typeof setTimeout> = 0 as unknown as ReturnType<typeof setTimeout>;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.startTyping();
  }

  ngOnDestroy() {
    if (this.typingInterval) {
      clearTimeout(this.typingInterval);
    }
  }

  private startTyping() {
    const currentText = this.placeholders[this.currentIndex];
    
    if (!this.isDeleting) {
      this.displayText = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
      this.changeDetectorRef.detectChanges(); 
      
      if (this.charIndex === currentText.length) {
        this.isDeleting = true;
        this.typingInterval = setTimeout(() => this.startTyping(), this.pauseTime);
        return;
      }
      
      this.typingInterval = setTimeout(() => this.startTyping(), this.typingSpeed);
    } else {
      this.displayText = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
      this.changeDetectorRef.detectChanges(); 
      
      if (this.charIndex === 0) {
        this.isDeleting = false;
        this.currentIndex = (this.currentIndex + 1) % this.placeholders.length;
        this.typingInterval = setTimeout(() => this.startTyping(), 500);
        return;
      }
      
      this.typingInterval = setTimeout(() => this.startTyping(), this.deletingSpeed);
    }
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }

  onSearchChange() {
    this.searchChange.emit(this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchChange.emit('');
  }
}
