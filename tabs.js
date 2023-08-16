function tabs() {
  const tabsOnPage = document.querySelectorAll('[data-tabs]');

  if (tabsOnPage.length) {
    tabsOnPage.forEach((tabItem) => {
      tabsInit(tabItem);
    });
  } else {
    console.log('Табов на странице нет.');
  }

  function tabsInit(currentTabs) {
    const tabsNavigation = currentTabs.querySelector('[data-tabs-navigation]');
    const tabsButtons = tabsNavigation.querySelectorAll('a');
    const tabsPanels = currentTabs.querySelectorAll('[data-tabs-body] > *');

    if (currentTabs.hasAttribute('data-tabs-height')) {
      const tabsBody = currentTabs.querySelector('[data-tabs-body]');
      const minHeight = Math.max.apply(
        null,
        Array.from(tabsPanels).map((el) => el.offsetHeight)
      );
      tabsBody.style.minHeight = `${minHeight}px`;
    }

    if (tabsNavigation.children.length !== tabsPanels.length) {
      console.error('Несоответствие навигации контенту табов в ', currentTabs);
      return false;
    }

    tabsNavigation.setAttribute('role', 'tablist');
    tabsNavigation.querySelectorAll('li').forEach((el) => el.setAttribute('role', 'presentation'));

    tabsButtons.forEach((tabsButton, index) => {
      tabsButton.setAttribute('role', 'tab');

      if (index === 0) {
        tabsButton.setAttribute('aria-selected', true);
      } else {
        tabsButton.setAttribute('tabindex', '-1');
        tabsPanels[index].hidden = true;
      }
    });

    tabsPanels.forEach((panel) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('tabindex', '0');
    });

    currentTabs.addEventListener('click', tabsOnClick);
    currentTabs.addEventListener('keydown', tabsOnKeyDown);

    function tabsOnKeyDown(e) {
      switch (e.key) {
        case 'ArrowRight':
          moveTabsRight();
          break;
        case 'ArrowLeft':
          moveTabsLeft();
          break;
        case 'Home':
          e.preventDefault();
          switchTab(tabsButtons[0]);
          break;
        case 'End':
          e.preventDefault();
          switchTab(tabsButtons[tabsButtons.length - 1]);
          break;
      }
    }
    function moveTabsLeft() {
      const activeTab = document.activeElement;
      if (!activeTab.parentElement.previousElementSibling) {
        switchTab(tabsButtons[tabsButtons.length - 1]);
      } else {
        switchTab(activeTab.parentElement.previousElementSibling.querySelector('a'));
      }
    }
    function moveTabsRight() {
      const activeTab = document.activeElement;
      if (!activeTab.parentElement.nextElementSibling) {
        switchTab(tabsButtons[0]);
      } else {
        switchTab(activeTab.parentElement.nextElementSibling.querySelector('a'));
      }
    }

    function tabsOnClick(e) {
      const clickedTab = e.target.closest('a');
      if (!clickedTab) return;

      e.preventDefault();
      switchTab(clickedTab);
    }

    function switchTab(newTab) {
      const activePanelId = newTab.getAttribute('href');
      const activePanel = currentTabs.querySelector(activePanelId);

      tabsButtons.forEach((button) => {
        button.setAttribute('aria-selected', false);
        button.setAttribute('tabindex', '-1');
      });

      tabsPanels.forEach((panel) => {
        panel.hidden = true;
      });
      activePanel.hidden = false;

      newTab.setAttribute('tabindex', '0');
      newTab.setAttribute('aria-selected', true);
      newTab.focus();
    }
  }
}

tabs();
