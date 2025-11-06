import { NO_ERRORS_SCHEMA, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SearchBar } from '@app/search-bar/search-bar';

describe('SearchBar', () => {
  let fixture: any;
  let searchBarComponent: SearchBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBar],
      providers: [provideZonelessChangeDetection()],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(SearchBar, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(SearchBar);
    searchBarComponent = fixture.componentInstance;

    (searchBarComponent as any).placeholders = ['ab', 'cd'];
    (searchBarComponent as any).typingSpeed = 10;
    (searchBarComponent as any).deletingSpeed = 10;
    (searchBarComponent as any).pauseTime = 20;

    fixture.detectChanges();
  });

  it('onFocus and onBlur toggle isFocused', () => {
    searchBarComponent.onFocus();
    expect(searchBarComponent.isFocused).toBeTrue();
    searchBarComponent.onBlur();
    expect(searchBarComponent.isFocused).toBeFalse();
  });

  it('onSearchChange emits current query', (done) => {
    searchBarComponent.searchQuery = 'hello';
    searchBarComponent.searchChange.subscribe((v) => {
      expect(v).toBe('hello');
      done();
    });
    searchBarComponent.onSearchChange();
  });

  it('clearSearch resets query and emits empty string', (done) => {
    searchBarComponent.searchQuery = 'xyz';
    searchBarComponent.searchChange.subscribe((v) => {
      expect(searchBarComponent.searchQuery).toBe('');
      expect(v).toBe('');
      done();
    });
    searchBarComponent.clearSearch();
  });

  it('ngOnDestroy clears pending timeout', () => {
    const handle = setTimeout(() => {}, 9999);
    (searchBarComponent as any).typingInterval = handle as any;
    const spy = spyOn(window, 'clearTimeout').and.callThrough();
    searchBarComponent.ngOnDestroy();
    expect(spy).toHaveBeenCalledWith(handle);
  });
});
