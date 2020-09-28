core.controllers.TextEditor = () => {
  core.log('Text editor initialized');
  
  function TextEditor (options) {
    this.stylizeText = options => {
      document.execCommand(options.style);
    };
    
    this.toolbarHandler = (action, options) => {
      event.preventDefault();
      switch (action) {
        case 'text':
          this.stylizeText(options);
          break;
      }
    };
    
    this.textareaHandler = () => {
      switch (event.keyCode) {
        case 9:
          event.preventDefault();
          document.execCommand('insertText', false, '\t');
          
          break;
      }
    };
    
    this.eventListeners = () => {
      $$(this.textarea).on('keydown', this.textareaHandler.bind(this));
      $$(this.toolbar.btnBold).on('mousedown', this.toolbarHandler.bind(this, 'text', { style: 'bold' }));
      $$(this.toolbar.btnItalic).on('mousedown', this.toolbarHandler.bind(this, 'text', { style: 'italic' }));
      $$(this.toolbar.btnUnderline).on('mousedown', this.toolbarHandler.bind(this, 'text', { style: 'underline' }));
      $$(this.toolbar.btnStrikethrough).on('mousedown', this.toolbarHandler.bind(this, 'text', { style: 'strikeThrough' }));
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
        border: '1px solid black',
        whiteSpace: 'pre-wrap'
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