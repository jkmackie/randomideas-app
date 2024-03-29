import IdeasApi from '../services/ideasApi';
import IdeaList from './IdeaList';

class IdeaForm {
  constructor() {
    this._formModal = document.querySelector('#form-modal');
    this._ideaList = new IdeaList();
  }

  addEventListeners() {
    // bind so "this" refers to the class instance instead the
    // element the event was called on.
    this._form.addEventListener('submit', this.handleSubmit.bind(this));

    this._closeIconClick.addEventListener(
      'click',
      this.formCloseIconClick.bind(this)
    );
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (
      !this._form.elements.text.value ||
      !this._form.elements.tag.value ||
      !this._form.elements.username.value
    ) {
      alert('Pleae enter all fields');
      return;
    }

    // Save user to local storage
    localStorage.setItem('username', this._form.elements.username.value);

    const idea = {
      text: this._form.elements.text.value,
      tag: this._form.elements.tag.value,
      username: this._form.elements.username.value,
    };

    // Add idea to server
    const newIdea = await IdeasApi.createIdea(idea);

    // Add idea to list (remember 1st data is whole object)
    this._ideaList.addIdeaToList(newIdea.data.data);

    // Clear fields
    this._form.elements.text.value = '';
    this._form.elements.tag.value = '';
    this._form.elements.username.value = '';

    this.render(); // render form to reflect storage element

    //dispatchEvent allows class components to interact with each other.
    document.dispatchEvent(new Event('closemodal'));
  }

  close() {
    this._modal.style.display = 'none';
  }

  formCloseIconClick(e) {
    if (e.target === this._closeIconClick) {
      //use close in local scope
      this.close();
    }
  }

  render() {
    this._formModal.innerHTML = `   
    <button id="modal-close-x" class="modal-close-x">
      <i id="modal-close-icon" class="fas fa-times"></i>
    </button>

    <form id="idea-form">
      <div class="form-control">            
        <label for="username">Enter a Username</label>
        <input type="text" name="username" id="username" value="${
          localStorage.getItem('username')
            ? localStorage.getItem('username')
            : ''
        }" />
      </div>

      <div class="form-control">
        <label for="idea-text">What's Your Idea?</label>
        <textarea name="text" id="idea-text"></textarea>
      </div>

      <div class="form-control-tag">
        <label for="tag">Tag</label>
        <select name="tag" id="tag">
          <option value="">Select a Tag</option>
          <option value="technology">Technology</option>
          <option value="software">Software</option>
          <option value="business">Business</option>
          <option value="education">Education</option>
          <option value="health">Health</option>
          <option value="inventions">Inventions</option>
        </select>
    </div>

      <button class="btn" type="submit" id="submit">Submit</button>
    </form>
    `;
    this._form = document.querySelector('#idea-form');
    this._modal = document.querySelector('#modal');
    this._closeIconClick = document.querySelector('#modal-close-icon');
    this.addEventListeners();
  }
}

export default IdeaForm;
