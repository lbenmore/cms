core.controllers.TextEditor = () => {
  core.log('Text editor initialized');
  
  function TextEditor (options) {
    this.insertImage = () => {
      const ts = new Date().getTime();
      const lightboxHtml = `
        <div class="lightbox lightbox${ts}">
          <div class="lightbox${ts}__container">
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
              <h4>-- SIZE --</h4>
              <div class="lightbox${ts}__inputWrapper">
              <label><input type="radio" class="lightbox${ts}__input lightbox${ts}__input--radio" name="size" value="inline" checked> Inline</label>
              <span style="display: inline-block: width: var(--gutter);"></span>
              <label><input type="radio" class="lightbox${ts}__input lightbox${ts}__input--radio" name="size" value="fullwidth"> Full Width</label>
              </div>
              <h4>--</h4>
              <div class="lightbox${ts}__preview"></div>
              <button class="lightbox${ts}__btn lightbox${ts}__btn--insert">Insert</button>
            </div>
          </div>
        </div>
      `;
      const lightbox = document.createElement('div');
      let to;
      
      lightbox.innerHTML = lightboxHtml;
      $$(core.container).appendChild(lightbox);
      
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
      
      function closeLightbox () {
        lightbox && lightbox.parentNode.removeChild(lightbox);
      }
      
      $$(`.lightbox${ts}__input--file`).on('input', evt => {
        /*
        this will eventually be replaced or finalized with 
        the use of uploading the image via php
        */
        const fr = new FileReader();
        
        fr.addEventListener('load', evt => {
          updatePreview(evt.target.result);
        });
        
        evt.target.files && evt.target.files.length && fr.readAsDataURL(evt.target.files[0]);
      });
      
      $$(`.lightbox${ts}__input--text`).on('input', () => {
        clearTimeout(to);
        to = setTimeout(evt => {
          updatePreview(evt.target.value);
        }, 750, event);
      });
      
      $$(`.lightbox${ts}__btn--insert`).on('click', () => {
        const img = $$(`.lightbox${ts}__preview`).querySelector('img');
        const width = $$(`.lightbox${ts}__input--radio[value=fullwidth`).checked ? '100%' : '240px';
        const height = 'auto';
        
        if (img) {
          $$(img).css({ width, height });
          this.textarea.appendChild(img);
        }
        
        closeLightbox();
      });
      
      $$(`.lightbox${ts}__container`).on('click', evt => {
        (evt.target === evt.currentTarget) && closeLightbox();
      });
    };
    
    this.stylizeText = options => {
      document.execCommand(options.style);
    };
    
    this.toolbarHandler = (action, options, evt) => {
      evt.preventDefault();
      switch (action) {
        case 'text':
          this.stylizeText(options);
          break;
          
        case 'plain':
          const html = this.toolbar.btnTogglePlainText.plain ? this.textarea.textContent : this.textarea.innerHTML;
          const newTag = document.createElement(this.toolbar.btnTogglePlainText.plain ? 'div' : 'textarea');
          
          newTag.innerHTML = html;
          this.textarea.replaceWith(newTag);
          this.textarea = newTag;
          
          this.stylize();
          this.decorate();
          
          this.toolbar.btnTogglePlainText.plain = !this.toolbar.btnTogglePlainText.plain;
          break;
      }
    };
    
    this.textareaHandler = evt => {
      switch (evt.keyCode) {
        case 9:
          evt.preventDefault();
          document.execCommand('insertText', false, '\t');
          
          break;
          
          default:
            $$.ls('set', 'bnmr_cms_currentPost', evt.target.innerHTML);
      }
    };
    
    this.eventListeners = () => {
      $$(this.textarea).on('keydown', this.textareaHandler.bind(this));
      $$(this.toolbar.btnBold).on('mousedown', this.toolbarHandler.bind(this, 'text', { style: 'bold' }));
      $$(this.toolbar.btnItalic).on('mousedown', this.toolbarHandler.bind(this, 'text', { style: 'italic' }));
      $$(this.toolbar.btnUnderline).on('mousedown', this.toolbarHandler.bind(this, 'text', { style: 'underline' }));
      $$(this.toolbar.btnStrikethrough).on('mousedown', this.toolbarHandler.bind(this, 'text', { style: 'strikeThrough' }));
      $$(this.toolbar.btnImage).on('click', this.insertImage.bind(this));
      $$(this.toolbar.btnTogglePlainText).on('mousedown', this.toolbarHandler.bind(this, 'plain'));
    };
    
    this.decorate = () => {
      this.textarea.setAttribute('contenteditable', 'true');
      
      const currentPost = $$.ls('get', 'bnmr_cms_currentPost');
      if (currentPost) this.textarea.innerHTML = currentPost;
    };
    
    this.addToDom = () => {
      this.container.appendChild(this.toolbar);
      this.container.appendChild(this.textarea);
      this.target.appendChild(this.container);
    };
    
    this.populate = () => {
      const [
        btnBold,
        btnItalic,
        btnUnderline,
        btnStrikethrough,
        btnImage,
        btnTogglePlainText
      ] = new Array(6).fill().map(x => document.createElement('button'));
      
      btnBold.innerHTML = '<b>B</b>';
      btnItalic.innerHTML = '<i>I</i>';
      btnUnderline.innerHTML = '<u>U</u>';
      btnStrikethrough.innerHTML = '<s>S</s>';
      btnImage.textContent = 'Insert Image';
      btnTogglePlainText.textContent = 'Toggle Plain Text';
      
      btnTogglePlainText.plain = false;
      
      this.toolbar.appendChild(btnBold);
      this.toolbar.appendChild(btnItalic);
      this.toolbar.appendChild(btnUnderline);
      this.toolbar.appendChild(btnStrikethrough);
      this.toolbar.appendChild(btnImage);
      // this hurts more than it helps
      // this.toolbar.appendChild(btnTogglePlainText);
      
      this.toolbar.btnBold = btnBold;
      this.toolbar.btnItalic = btnItalic;
      this.toolbar.btnUnderline = btnUnderline;
      this.toolbar.btnStrikethrough = btnStrikethrough;
      this.toolbar.btnImage = btnImage;
      this.toolbar.btnTogglePlainText = btnTogglePlainText;
    };
      
    this.init = options => {
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
      this.addToDom();
      this.decorate();
      this.eventListeners();
    };
    
    this.init(options);
    
    return this.textarea;
  };
  
  core.events.textEditorLoad = new CustomEvent('coreComponentLoad', {
    detail: {
      component: TextEditor,
      componentName: 'TextEditor'
    }
  });
  
  setTimeout(() => {
    core.events.dispatchEvent(core.events.textEditorLoad);
  });
};
