import { Config } from './config.js';
import { API } from './api.js';
import { UI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  UI.init();

  // Event Listeners
  UI.elements.findTopicsBtn.addEventListener('click', handleFindTopics);
  UI.elements.generatePostBtn.addEventListener('click', handleGeneratePost);

  // Settings Modal Listeners
  UI.elements.openSettingsBtn.addEventListener('click', UI.showSettingsModal.bind(UI));
  UI.elements.closeSettingsBtn.addEventListener('click', UI.hideSettingsModal.bind(UI));
  UI.elements.saveSettingsBtn.addEventListener('click', handleSaveSettings);

  // Close modal on outside click
  UI.elements.settingsModal.addEventListener('click', (e) => {
    if (e.target === UI.elements.settingsModal) {
      UI.hideSettingsModal();
    }
  });

  // Check for keys on load
  if (!Config.hasKeys()) {
    UI.showSettingsModal();
    UI.alertMessage('Please configure your Gemini API key to start.', 'error');
  }
});

async function handleFindTopics() {
  const keywords = UI.elements.keywordInput.value.trim();
  if (!keywords) {
    UI.displayError(UI.elements.topicsError, 'Please enter keywords for research.');
    return;
  }

  if (!Config.getGeminiKey()) {
    UI.showSettingsModal();
    UI.alertMessage('Gemini API Key is missing.', 'error');
    return;
  }

  UI.elements.trendingTopicsList.innerHTML = '<li class="text-gray-600">Fetching topics...</li>';
  UI.clearError(UI.elements.topicsError);
  UI.elements.topicsSpinner.style.display = 'inline-block';
  UI.elements.findTopicsBtn.disabled = true;

  try {
    const topics = await API.findTrendingTopics(keywords);
    UI.displayTrendingTopics(topics, (selectedTopic) => {
      UI.elements.selectedTopicInput.value = selectedTopic;
    });
  } catch (error) {
    console.error(error);
    UI.displayError(UI.elements.topicsError, error.message);
    UI.elements.trendingTopicsList.innerHTML = '<li class="text-gray-600">Error loading topics.</li>';
  } finally {
    UI.elements.topicsSpinner.style.display = 'none';
    UI.elements.findTopicsBtn.disabled = false;
  }
}

async function handleGeneratePost() {
  const topic = UI.elements.selectedTopicInput.value.trim();
  const userStyle = UI.elements.userStyleInput.value.trim();
  const numPosts = parseInt(UI.elements.numPostsInput.value, 10);

  if (!topic) {
    UI.displayError(UI.elements.postError, 'Please select a trending topic first.');
    return;
  }
  if (isNaN(numPosts) || numPosts < 1 || numPosts > 5) {
    UI.displayError(UI.elements.postError, 'Please enter a valid number of posts (1-5).');
    return;
  }

  if (!Config.hasKeys()) {
    UI.showSettingsModal();
    UI.alertMessage('Gemini API Key is missing.', 'error');
    return;
  }

  UI.elements.generatedPostsContainer.innerHTML = '<p class="text-gray-600">Generating post(s) and image(s)...</p>';
  UI.clearError(UI.elements.postError);
  UI.elements.postSpinner.style.display = 'inline-block';
  UI.elements.generatePostBtn.disabled = true;

  try {
    const generatedItems = [];
    for (let i = 0; i < numPosts; i++) {
      let text = '';
      let imageUrl = 'https://placehold.co/400x200/cccccc/333333?text=Image+Error';
      let postingTime = 'No suggestion available.';

      // 1. Generate Text
      try {
        text = await API.generatePostText(topic, userStyle, i + 1, numPosts);
      } catch (textError) {
        console.error(`Post ${i + 1} text generation failed:`, textError);
        text = `Failed to generate post text. Error: ${textError.message}`;
      }

      // 2. Generate Image using Puter.js
      let imageQuery = topic;
      if (text && !text.startsWith('Failed')) {
        // Use a portion of the generated text if available and not an error message
        imageQuery = text.substring(0, 100).split(' ').slice(0, 10).join(' ');
      }
      imageQuery += " professional, technology, business, innovation, abstract";

      try {
        imageUrl = await API.generateImageWithPuter(imageQuery);
      } catch (imgError) {
        console.warn('Image generation failed:', imgError);
        // Keep default placeholder
      }

      // 3. Get Posting Time
      try {
        postingTime = await API.getOptimalPostingTimes(text, topic);
      } catch (timeError) {
        console.warn('Posting time fetch failed:', timeError);
      }

      generatedItems.push({ text, imageUrl, postingTime });
    }
    UI.displayGeneratedPosts(generatedItems);

  } catch (error) {
    console.error(error);
    UI.displayError(UI.elements.postError, 'Failed to generate content. ' + error.message);
    UI.elements.generatedPostsContainer.innerHTML = '<p class="text-gray-600">Error generating posts.</p>';
  } finally {
    UI.elements.postSpinner.style.display = 'none';
    UI.elements.generatePostBtn.disabled = false;
  }
}

function handleSaveSettings() {
  const geminiKey = UI.elements.geminiKeyInput.value.trim();

  if (geminiKey) Config.setGeminiKey(geminiKey);

  UI.hideSettingsModal();
  UI.alertMessage('Settings saved!', 'success');
}
