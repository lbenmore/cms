core.controllers.TextEditor = () => {
  core.log('Text editor initialized');
  
  function TextEditor (options) {
    this.stylizeText = options => {
      const sel = document.getSelection();
      const rng = sel.getRangeAt(0);
      const tag = document.createElement('span');
      
      switch (options.style) {
        case 'bold':
          tag.classList.add('font-bold');
          break;
          
        case 'italic':
          tag.classList.add('font-italic');
          break;
          
        case 'underline':
          tag.classList.add('font-underline');
          break;
          
        case 'strikethrough':
          tag.classList.add('font-strike');
          break;
      }
      
      rng.surroundContents(tag);
    };
    
    this.toolbarHandler = (action, options) => {
      event.preventDefault();
      switch (action) {
        case 'text':
          this.stylizeText(options);
          break;
      }
    };
    
    this.eventListeners = () => {
      $$(this.textarea).on('keydown', () => {
        // tab button. not doing what i want
        if (event.keyCode === 9) {
          // event.preventDefault();
          // event.target.innerHTML += '\t';
          // event.target.innerHTML = event.target.innerHTML;
          
          // not working
          // const _ = event.target;
          // _.selectionStart = _.selectionEnd = _.textContent.length;
        }
      });
      
      $$(this.toolbar.btnBold).on('click', this.toolbarHandler.bind(this, 'text', { style: 'bold' }));
      $$(this.toolbar.btnItalic).on('click', this.toolbarHandler.bind(this, 'text', { style: 'italic' }));
      $$(this.toolbar.btnUnderline).on('click', this.toolbarHandler.bind(this, 'text', { style: 'underline' }));
      $$(this.toolbar.btnStrikethrough).on('click', this.toolbarHandler.bind(this, 'text', { style: 'strikethrough' }));
    };
    
    this.decorate = () => {
      this.textarea.setAttribute('contenteditable', 'true');
    };
    
    this.addToDom = () => {
      this.container.appendChild(this.toolbar);
      this.container.appendChild(this.textarea);
      this.target.appendChild(this.container);
    };
    
    this.stylize = () => {
      Object.assign(this.container.style, {
        margin: 'var(--gutter) 0',
        padding: 'var(--gutter)',
        width: '100%',
        height: '100%',
        border: '1px solid black'
      });
      
      Object.assign(this.toolbar.style, {
        marginBottom: 'var(--gutter)'
      })
      
      Object.assign(this.textarea.style, {
        padding: 'var(--gutter)',
        width: '100%',
        height: '100%',
        border: '1px solid black'
      });
    };
    
    this.populate = () => {
      const [
        btnBold,
        btnItalic,
        btnUnderline,
        btnStrikethrough,
        btnImage
      ] = new Array(5).fill('').map(x => document.createElement('button'));
      
      btnBold.textContent = 'B';
      btnItalic.textContent = 'I';
      btnUnderline.textContent = 'U';
      btnStrikethrough.textContent = 'S';
      btnImage.textContent = '[]';
      
      this.toolbar.appendChild(btnBold);
      this.toolbar.appendChild(btnItalic);
      this.toolbar.appendChild(btnUnderline);
      this.toolbar.appendChild(btnStrikethrough);
      this.toolbar.appendChild(btnImage);
      
      this.toolbar.btnBold = btnBold;
      this.toolbar.btnItalic = btnItalic;
      this.toolbar.btnUnderline = btnUnderline;
      this.toolbar.btnStrikethrough = btnStrikethrough;
      this.toolbar.btnImage = btnImage;
    };
      
    this.init = () => {
      for (const _ in options) this[_] = options[_];
      
      [
        'container',
        'toolbar',
        'textarea'
      ].forEach(el => {
        this[el] = document.createElement('div');
        this[el].classList.add(`texteditor-${el}`);
      });
      
      this.populate();
      this.stylize();
      this.addToDom();
      this.decorate();
      this.eventListeners();
    };
    
    this.init();
  }
  
  function instantiateTextEditor () {
    new TextEditor({
      target: $$('.TextEditor')
    });
  }
  
  if (core.events.pageLoaded) instantiateTextEditor();
  else core.events.addEventListener('corePageLoad', instantiateTextEditor);
};