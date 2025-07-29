
  document.addEventListener('DOMContentLoaded', function() {
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotSubmit = document.getElementById('chatbot-submit');
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');

    // Scroll lock functions
    let scrollPosition = 0;

    function disableBodyScroll() {
      scrollPosition = window.pageYOffset;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
    }

    function enableBodyScroll() {
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('width');
      window.scrollTo(0, scrollPosition);
    }

    // Toggle chat window
    chatbotButton.addEventListener('click', function() {
      chatbotWindow.classList.toggle('hidden');
      if (!chatbotWindow.classList.contains('hidden')) {
        chatbotInput.focus();
        disableBodyScroll(); // Disable background scroll when chat opens
        playSound('open');
      } else {
        enableBodyScroll(); // Enable background scroll when chat closes
      }
    });

    // Close chat window
    chatbotClose.addEventListener('click', function() {
      chatbotWindow.classList.add('hidden');
      enableBodyScroll(); // Enable background scroll when chat closes
      playSound('close');
    });

    // Prevent scroll propagation from chat messages to body
    chatbotMessages.addEventListener('wheel', function(e) {
      const delta = e.deltaY;
      const scrollTop = this.scrollTop;
      const scrollHeight = this.scrollHeight;
      const height = this.clientHeight;

      // Prevent scroll from propagating to body
      if ((delta < 0 && scrollTop === 0) || 
          (delta > 0 && scrollTop + height >= scrollHeight)) {
        e.preventDefault();
      }
      e.stopPropagation();
    });

    // Prevent touch scroll propagation on mobile
    let touchStartY = 0;
    
    chatbotMessages.addEventListener('touchstart', function(e) {
      touchStartY = e.touches[0].clientY;
    });

    chatbotMessages.addEventListener('touchmove', function(e) {
      const touchY = e.touches[0].clientY;
      const delta = touchStartY - touchY;
      const scrollTop = this.scrollTop;
      const scrollHeight = this.scrollHeight;
      const height = this.clientHeight;

      // Prevent scroll when at boundaries
      if ((delta < 0 && scrollTop === 0) || 
          (delta > 0 && scrollTop + height >= scrollHeight)) {
        e.preventDefault();
      }
      e.stopPropagation();
    }, { passive: false });

    // Quick action buttons
    quickActionBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const message = this.getAttribute('data-message');
        chatbotInput.value = message;
        chatbotForm.dispatchEvent(new Event('submit'));
      });
    });

    // Handle form submission
    chatbotForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const message = chatbotInput.value.trim();
      if (!message) return;
      
      // Add user message to chat
      addMessage(message, true);
      
      // Clear input
      chatbotInput.value = '';
      
      // Play send sound
      playSound('send');
      
      // Show typing indicator
      showTypingIndicator();
      
      try {
        // Call your backend API
        const response = await fetch('https://esportschatbot-production.up.railway.app/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: message }),
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add bot response to chat
        addMessage(data.message, false);
        
        // Play receive sound
        playSound('receive');
      } catch (error) {
        console.error('Error sending message:', error);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add error message
        addMessage('Connection error! Please check your internet and try again.', false);
      }
    });

    // Function to add a message to the chat
    function addMessage(text, isUser) {
      const messageDiv = document.createElement('div');
      messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
      
      if (!isUser) {
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = '<div class="bot-avatar-icon">🎮</div>';
        messageDiv.appendChild(avatarDiv);
      }
      
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      
      if (!isUser) {
        messageContent.innerHTML = `<span class="message-author">ColabEsports Bot</span>${text}`;
      } else {
        messageContent.textContent = text;
      }
      
      messageDiv.appendChild(messageContent);
      chatbotMessages.appendChild(messageDiv);
      
      // Scroll to bottom
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Function to show typing indicator
    function showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'message bot-message typing-message';
      typingDiv.innerHTML = `
        <div class="message-avatar">
          <div class="bot-avatar-icon">🎮</div>
        </div>
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;
      chatbotMessages.appendChild(typingDiv);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Function to remove typing indicator
    function removeTypingIndicator() {
      const typingMessage = document.querySelector('.typing-message');
      if (typingMessage) {
        typingMessage.remove();
      }
    }

    // Sound effects (optional)
    function playSound(type) {
      // You can add sound effects here
      // const audio = new Audio(`/sounds/${type}.mp3`);
      // audio.play();
    }

    // Add keyboard shortcut (Ctrl/Cmd + /)
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        chatbotWindow.classList.toggle('hidden');
        if (!chatbotWindow.classList.contains('hidden')) {
          chatbotInput.focus();
          disableBodyScroll();
        } else {
          enableBodyScroll();
        }
      }
    });

    // Clean up on page unload
    window.addEventListener('beforeunload', function() {
      enableBodyScroll();
    });
  });
