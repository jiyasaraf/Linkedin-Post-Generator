import { Config } from './config.js';

export const UI = {
  elements: {
    keywordInput: document.getElementById('keywordInput'),
    findTopicsBtn: document.getElementById('findTopicsBtn'),
    topicsSpinner: document.getElementById('topicsSpinner'),
    topicsError: document.getElementById('topicsError'),
    trendingTopicsList: document.getElementById('trendingTopicsList'),
    selectedTopicInput: document.getElementById('selectedTopic'),
    numPostsInput: document.getElementById('numPostsInput'),
    userStyleInput: document.getElementById('userStyleInput'),
    generatePostBtn: document.getElementById('generatePostBtn'),
    postSpinner: document.getElementById('postSpinner'),
    postError: document.getElementById('postError'),
    generatedPostsContainer: document.getElementById('generatedPostsContainer'),
    appMessageDiv: document.getElementById('appMessage'),
    settingsModal: document.getElementById('settingsModal'),
    geminiKeyInput: document.getElementById('geminiKeyInput'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    closeSettingsBtn: document.getElementById('closeSettingsBtn'),
    openSettingsBtn: document.getElementById('openSettingsBtn')
  },

  init() {
    // Re-query elements in case they weren't ready
    this.refreshElements();
  },

  refreshElements() {
    // Helper to get element by ID safely
    const get = (id) => document.getElementById(id);

    this.elements = {
      keywordInput: get('keywordInput'),
      findTopicsBtn: get('findTopicsBtn'),
      topicsSpinner: get('topicsSpinner'),
      topicsError: get('topicsError'),
      trendingTopicsList: get('trendingTopicsList'),
      selectedTopicInput: get('selectedTopic'),
      numPostsInput: get('numPostsInput'),
      userStyleInput: get('userStyleInput'),
      generatePostBtn: get('generatePostBtn'),
      postSpinner: get('postSpinner'),
      postError: get('postError'),
      generatedPostsContainer: get('generatedPostsContainer'),
      appMessageDiv: get('appMessage'),
      settingsModal: get('settingsModal'),
      geminiKeyInput: get('geminiKeyInput'),
      saveSettingsBtn: get('saveSettingsBtn'),
      closeSettingsBtn: get('closeSettingsBtn'),
      openSettingsBtn: get('openSettingsBtn')
    };
  },

  displayTrendingTopics(topics, onSelect) {
    const list = this.elements.trendingTopicsList;
    list.innerHTML = '';
    if (topics.length === 0) {
      list.innerHTML = '<li class="text-gray-600">No topics found.</li>';
      return;
    }

    topics.forEach(topic => {
      const li = document.createElement('li');
      li.className = 'topic-item';
      li.textContent = topic;
      li.addEventListener('click', () => {
        // Remove selected class from others
        document.querySelectorAll('.topic-item').forEach(item => item.classList.remove('selected'));
        li.classList.add('selected');
        onSelect(topic);
      });
      list.appendChild(li);
    });
  },

  displayGeneratedPosts(items) {
    const container = this.elements.generatedPostsContainer;
    container.innerHTML = '';
    if (items.length === 0) {
      container.innerHTML = '<p class="text-gray-600">No posts generated.</p>';
      return;
    }

    items.forEach((item, index) => {
      const postCard = document.createElement('div');
      postCard.className = 'generated-post-card flex flex-col';
      postCard.innerHTML = `
                <p class="text-sm font-semibold text-gray-700 mb-2">Post Option ${index + 1}:</p>
                <div class="post-image-container">
                    <img src="${item.imageUrl}" alt="Generated image for post" class="post-image" onerror="this.onerror=null;this.src='https://placehold.co/400x200/cccccc/333333?text=Image+Load+Error';">
                </div>
                <button class="btn btn-secondary mt-2 w-full download-image-btn">Download Image</button>
                <div class="output-box flex-grow w-full mt-4">${item.text}</div>
                <div class="posting-time-suggestion">
                    <strong>Suggested Posting Time:</strong> ${item.postingTime}
                </div>
                <div class="button-group">
                    <button class="copy-btn btn btn-secondary">Copy Post ${index + 1}</button>
                    <button class="btn btn-primary share-linkedin-btn">Share to LinkedIn</button>
                </div>
            `;

      postCard.querySelector('.download-image-btn').addEventListener('click', () => this.downloadImage(item.imageUrl, `linkedin_image_${index + 1}.png`));
      postCard.querySelector('.copy-btn').addEventListener('click', () => this.copyToClipboard(item.text));
      postCard.querySelector('.share-linkedin-btn').addEventListener('click', () => this.shareToLinkedIn(encodeURIComponent(item.text)));

      container.appendChild(postCard);
    });
  },

  displayError(element, message) {
    if (element) {
      element.textContent = message;
      element.style.display = 'block';
    }
  },

  clearError(element) {
    if (element) {
      element.style.display = 'none';
      element.textContent = '';
    }
  },

  alertMessage(message, type) {
    const div = this.elements.appMessageDiv;
    div.textContent = message;
    div.className = `app-message ${type}`;
    div.style.display = 'block';
    div.style.opacity = 1;

    setTimeout(() => {
      div.style.opacity = 0;
      setTimeout(() => div.style.display = 'none', 300);
    }, 3000);
  },

  copyToClipboard(text) {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        this.alertMessage('Post copied to clipboard!', 'success');
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        this.alertMessage('Failed to copy post. Please copy manually.', 'error');
      });
    }
  },

  downloadImage(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this.alertMessage('Image download initiated!', 'success');
  },

  shareToLinkedIn(encodedText) {
    const linkedinShareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}`;
    window.open(linkedinShareUrl, '_blank');
    this.alertMessage('Opening LinkedIn share dialog!', 'success');
  },

  showSettingsModal() {
    this.elements.geminiKeyInput.value = Config.getGeminiKey();
    this.elements.settingsModal.classList.add('active');
  },

  hideSettingsModal() {
    this.elements.settingsModal.classList.remove('active');
  }
};
