core.controllers.text_editor = () => {
  core.log('Text editor initialized');
  
  function TextEditor (options) {
    this.toolbarHandler = (action, options) => {
      event.preventDefault();
      switch (action) {
        case 'text':
          const sel = document.getSelection();
          const rng = sel.getRangeAt(0);
          const tag = document.createElement('span');
          const style = event.target.dataset.style;
          
          switch (options.style) {
            case 'bold':
              tag.style.fontWeight = 'bold';
              break;
              
            case 'italic':
              tag.style.fontStyle = 'italic';
              break;
              
            case 'underline':
              tag.style.textDecoration = 'underline';
              break;
          }
          
          rng.surroundContents(tag);
          
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
        btnImage
      ] = new Array(4).fill().map(x => document.createElement('button'));
      
      btnBold.textContent = 'B';
      btnItalic.textContent = 'I';
      btnUnderline.textContent = 'U';
      btnImage.textContent = '[]';
      
      this.toolbar.appendChild(btnBold);
      this.toolbar.appendChild(btnItalic);
      this.toolbar.appendChild(btnUnderline);
      this.toolbar.appendChild(btnImage);
      
      this.toolbar.btnBold = btnBold;
      this.toolbar.btnItalic = btnItalic;
      this.toolbar.btnUnderline = btnUnderline;
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
        this[el].classList.add(el);
      });
      
      this.populate();
      this.stylize();
      this.addToDom();
      this.decorate();
      this.eventListeners();
    };
    
    this.init();
  }
  
  new TextEditor({
    target: $$('.TextEditor')
  })
};