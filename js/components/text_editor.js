core.controllers.TextEditor = () => {
  core.log('Text editor initialized');
  
  function TextEditor (options) {
    this.insertImage = () => {
      const ts = new Date().getTime();
      const lightboxHtml = `
        <div class="lightbox${ts}">
          <div class="lightbox${ts}__panel">
            <h3>Insert an Image</h3>
            <div class="lightbox${ts}__inputWrapper">
              <label class="lightbox${ts}__label" for="lightbox${ts}__input--image">Drag Image Here or Click to Select</label>
              <input class="lightbox${ts}__input lightbox${ts}__input--file" id="lightbox${ts}__input--image" type="file">
            </div>
            <h4>-- OR --</h4>
            <div class="lightbox${ts}__inputWrapper">
              <input type="text" class="lightbox${ts}__input lightbox${ts}__input--text" placeholder="Image URL">
            </div>
            <h4>--</h4>
            <div class="lightbox${ts}__preview"></div>
            <button class="lightbox${ts}__btn lightbox${ts}__btn--insert">Insert</button>
          </div>
        </div>
      `;
      const lightbox = document.createElement('div');
      let to;
      
      function updatePreview (url) {
        const img = document.createElement('img');
        img.src = url;
        $$(img).css({
          width: '240px',
          height: 'auto'
        });
        $$(`.lightbox${ts}__preview`).innerHTML = '';
        $$(`.lightbox${ts}__preview`).appendChild(img);
      }
      
      lightbox.innerHTML = lightboxHtml;
      $$(core.container).appendChild(lightbox);
      
      $$(`.lightbox${ts}`).css({
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: 'calc(100 * var(--vh))',
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
      });
      
      $$(`.lightbox${ts}__panel`).css({
        position: 'absolute',
        top: '50%',
        left: '50%',
        padding: 'var(--gutter)',
        backgroundColor: '#fff',
        transform: 'translate(-50%, -50%)'
      });
      
      $$(`.lightbox${ts}__label`).css({
        display: 'block',
        position: 'relative',
        width: '240px',
        height: '120px',
        padding: 'var(--gutter)',
        border: '1px dotted black'
      });
      
      $$(`.lightbox${ts}__input--file`).css({
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        opacity: '0'
      });
      
      $$(`.lightbox${ts}__input--file`).on('input', () => {
        /*
        this will eventually be replaced or finalized with 
        the use of uploading the image via php
        */
        const fr = new FileReader();
        
        fr.addEventListener('load', () => {
          updatePreview(event.target.result);
        });
        
        event.target.files && event.target.files.length && fr.readAsDataURL(event.target.files[0]);
      });
      
      $$(`.lightbox${ts}__input--text`).on('input', () => {
        clearTimeout(to);
        to = setTimeout(evt => {
          updatePreview(evt.target.value);
        }, 750, event);
      });
      
      $$(`.lightbox${ts}__btn--insert`).on('click', () => {
        const img = $$(`.lightbox${ts}__preview`).querySelector('img');
        this.textarea.appendChild(img);
        $$(core.container).removeChild(lightbox);
      });
      
      $$(`.lightbox${ts}`).on('click', () => {
        if (event.target === event.currentTarget) {
          $$(core.container).removeChild(lightbox);
        }
      });
    };
    
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
      $$(this.toolbar.btnImage).on('click', this.insertImage.bind(this));
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