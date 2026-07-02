<<<<<<< HEAD
/**
 * QA Dashboard Controller
 * Handles task state management, drag-and-drop operations, and local storage persistence.
 * Built without frameworks to demonstrate core JavaScript DOM manipulation and Web APIs.
 */
class QADashboard {
    constructor() {
        this.storageKey = 'feynlab_qa_tasks';
        this.tasks = this._initializeData();

        this.cacheDOM();
        this.bindEvents();
        this.renderBoard();
    }

    /**
     * Retrieves existing tasks from local storage or sets a default mock ticket.
     * @returns {Array} Array of task objects
     */
    _initializeData() {
        const savedData = localStorage.getItem(this.storageKey);
        
        if (savedData) {
            return JSON.parse(savedData);
        }

        // Provide a default ticket so the board isn't empty on first load
        return [{
            id: this._generateTicketID(),
            title: 'System Partition Not Recognizing 5200MHz RAM Speed',
            severity: 'medium',
            status: 'backlog',
            date: new Date().toLocaleDateString()
        }];
    }

    /**
     * Stores DOM elements in memory to prevent repetitive, expensive document queries.
     */
    cacheDOM() {
        this.dom = {
            modal: document.getElementById('bugModal'),
            openModalBtn: document.getElementById('openModalBtn'),
            closeModalBtn: document.getElementById('closeModalBtn'),
            bugForm: document.getElementById('bugForm'),
            taskColumns: document.querySelectorAll('.task-list'),
            counters: {
                backlog: document.getElementById('count-backlog'),
                inProgress: document.getElementById('count-in-progress'),
                resolved: document.getElementById('count-resolved')
            }
        };
    }

    /**
     * Attaches all event listeners for the application.
     */
    bindEvents() {
        // Defensive check: abort if the required DOM elements don't exist
        if (!this.dom.modal || !this.dom.bugForm) {
            console.error('QA Dashboard: Required DOM elements are missing.');
            return;
        }

        // Modal Controls
        this.dom.openModalBtn.addEventListener('click', () => this.toggleModal(true));
        this.dom.closeModalBtn.addEventListener('click', () => this.toggleModal(false));
        
        // Close modal when clicking outside the content area
        this.dom.modal.addEventListener('click', (event) => {
            if (event.target === this.dom.modal) this.toggleModal(false);
        });

        // Form Submission
        this.dom.bugForm.addEventListener('submit', (event) => this.handleTicketSubmission(event));

        // Drag and Drop implementation for all columns
        this.dom.taskColumns.forEach(column => {
            column.addEventListener('dragover', (event) => this.handleDragOver(event, column));
            column.addEventListener('dragleave', (event) => this.handleDragLeave(event, column));
            column.addEventListener('drop', (event) => this.handleDrop(event, column));
        });
    }

    /* =====================================================================
       CORE LOGIC & UI UPDATES
       ===================================================================== */

    toggleModal(isOpen) {
        if (isOpen) {
            this.dom.modal.classList.remove('hidden');
        } else {
            this.dom.modal.classList.add('hidden');
            this.dom.bugForm.reset();
        }
    }

    handleTicketSubmission(event) {
        event.preventDefault(); // Prevent page reload
        
        const newTask = {
            id: this._generateTicketID(),
            title: document.getElementById('bugTitle').value.trim(),
            severity: document.getElementById('bugSeverity').value,
            status: 'backlog', // All new tickets start in the backlog
            date: new Date().toLocaleDateString()
        };

        this.tasks.push(newTask);
        this.saveState();
        this.renderBoard();
        this.toggleModal(false);
    }

    renderBoard() {
        // 1. Clear the current board
        this.dom.taskColumns.forEach(column => column.innerHTML = '');

        // 2. Reset counters
        const counts = { 'backlog': 0, 'in-progress': 0, 'resolved': 0 };

        // 3. Build and place each card
        this.tasks.forEach(task => {
            const cardElement = this._buildTaskCard(task);
            
            // Append to the specific column based on the task's status
            const targetColumn = document.getElementById(task.status);
            if (targetColumn) {
                targetColumn.appendChild(cardElement);
                counts[task.status]++;
            }
        });

        // 4. Update UI counters
        this.dom.counters.backlog.textContent = counts['backlog'];
        this.dom.counters.inProgress.textContent = counts['in-progress'];
        this.dom.counters.resolved.textContent = counts['resolved'];
    }

    /**
     * Constructs the HTML element for a task card and attaches its drag events.
     * @param {Object} task - The task data object
     * @returns {HTMLElement} The fully constructed task card
     */
    _buildTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.draggable = true;
        card.dataset.id = task.id;
        
        card.innerHTML = `
            <div class="task-title">${task.title}</div>
            <div class="task-meta">
                <span class="ticket-id">${task.id}</span>
                <span class="tag ${task.severity}">${task.severity}</span>
            </div>
        `;

        // Attach drag events directly to the card as it is created
        card.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', task.id);
            // setTimeout ensures the ghost image is created before making the original transparent
            setTimeout(() => card.style.opacity = '0.5', 0);
        });

        card.addEventListener('dragend', () => {
            card.style.opacity = '1';
        });

        return card;
    }

    saveState() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    }

    /* =====================================================================
       DRAG AND DROP HANDLERS
       ===================================================================== */

    handleDragOver(event, column) {
        // Prevent default is strictly required by the browser to allow dropping
        event.preventDefault(); 
        column.classList.add('drag-over');
    }

    handleDragLeave(event, column) {
        column.classList.remove('drag-over');
    }

    handleDrop(event, column) {
        event.preventDefault();
        column.classList.remove('drag-over');
        
        const draggedTaskId = event.dataTransfer.getData('text/plain');
        const targetStatus = column.dataset.status;

        // Find the task in our state array and update its status
        const taskIndex = this.tasks.findIndex(t => t.id === draggedTaskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].status = targetStatus;
            this.saveState();
            
            // Re-render the board to reflect the new state
            this.renderBoard(); 
        }
    }

    /* =====================================================================
       UTILITIES
       ===================================================================== */

    _generateTicketID() {
        return 'TKT-' + Math.floor(1000 + Math.random() * 9000);
    }
}

// Initialize application safely once the DOM is fully constructed
=======
/**
 * QA Dashboard Controller
 * Handles task state management, drag-and-drop operations, and local storage persistence.
 * Built without frameworks to demonstrate core JavaScript DOM manipulation and Web APIs.
 */
class QADashboard {
    constructor() {
        this.storageKey = 'feynlab_qa_tasks';
        this.tasks = this._initializeData();

        this.cacheDOM();
        this.bindEvents();
        this.renderBoard();
    }

    /**
     * Retrieves existing tasks from local storage or sets a default mock ticket.
     * @returns {Array} Array of task objects
     */
    _initializeData() {
        const savedData = localStorage.getItem(this.storageKey);
        
        if (savedData) {
            return JSON.parse(savedData);
        }

        // Provide a default ticket so the board isn't empty on first load
        return [{
            id: this._generateTicketID(),
            title: 'System Partition Not Recognizing 5200MHz RAM Speed',
            severity: 'medium',
            status: 'backlog',
            date: new Date().toLocaleDateString()
        }];
    }

    /**
     * Stores DOM elements in memory to prevent repetitive, expensive document queries.
     */
    cacheDOM() {
        this.dom = {
            modal: document.getElementById('bugModal'),
            openModalBtn: document.getElementById('openModalBtn'),
            closeModalBtn: document.getElementById('closeModalBtn'),
            bugForm: document.getElementById('bugForm'),
            taskColumns: document.querySelectorAll('.task-list'),
            counters: {
                backlog: document.getElementById('count-backlog'),
                inProgress: document.getElementById('count-in-progress'),
                resolved: document.getElementById('count-resolved')
            }
        };
    }

    /**
     * Attaches all event listeners for the application.
     */
    bindEvents() {
        // Defensive check: abort if the required DOM elements don't exist
        if (!this.dom.modal || !this.dom.bugForm) {
            console.error('QA Dashboard: Required DOM elements are missing.');
            return;
        }

        // Modal Controls
        this.dom.openModalBtn.addEventListener('click', () => this.toggleModal(true));
        this.dom.closeModalBtn.addEventListener('click', () => this.toggleModal(false));
        
        // Close modal when clicking outside the content area
        this.dom.modal.addEventListener('click', (event) => {
            if (event.target === this.dom.modal) this.toggleModal(false);
        });

        // Form Submission
        this.dom.bugForm.addEventListener('submit', (event) => this.handleTicketSubmission(event));

        // Drag and Drop implementation for all columns
        this.dom.taskColumns.forEach(column => {
            column.addEventListener('dragover', (event) => this.handleDragOver(event, column));
            column.addEventListener('dragleave', (event) => this.handleDragLeave(event, column));
            column.addEventListener('drop', (event) => this.handleDrop(event, column));
        });
    }

    /* =====================================================================
       CORE LOGIC & UI UPDATES
       ===================================================================== */

    toggleModal(isOpen) {
        if (isOpen) {
            this.dom.modal.classList.remove('hidden');
        } else {
            this.dom.modal.classList.add('hidden');
            this.dom.bugForm.reset();
        }
    }

    handleTicketSubmission(event) {
        event.preventDefault(); // Prevent page reload
        
        const newTask = {
            id: this._generateTicketID(),
            title: document.getElementById('bugTitle').value.trim(),
            severity: document.getElementById('bugSeverity').value,
            status: 'backlog', // All new tickets start in the backlog
            date: new Date().toLocaleDateString()
        };

        this.tasks.push(newTask);
        this.saveState();
        this.renderBoard();
        this.toggleModal(false);
    }

    renderBoard() {
        // 1. Clear the current board
        this.dom.taskColumns.forEach(column => column.innerHTML = '');

        // 2. Reset counters
        const counts = { 'backlog': 0, 'in-progress': 0, 'resolved': 0 };

        // 3. Build and place each card
        this.tasks.forEach(task => {
            const cardElement = this._buildTaskCard(task);
            
            // Append to the specific column based on the task's status
            const targetColumn = document.getElementById(task.status);
            if (targetColumn) {
                targetColumn.appendChild(cardElement);
                counts[task.status]++;
            }
        });

        // 4. Update UI counters
        this.dom.counters.backlog.textContent = counts['backlog'];
        this.dom.counters.inProgress.textContent = counts['in-progress'];
        this.dom.counters.resolved.textContent = counts['resolved'];
    }

    /**
     * Constructs the HTML element for a task card and attaches its drag events.
     * @param {Object} task - The task data object
     * @returns {HTMLElement} The fully constructed task card
     */
    _buildTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.draggable = true;
        card.dataset.id = task.id;
        
        card.innerHTML = `
            <div class="task-title">${task.title}</div>
            <div class="task-meta">
                <span class="ticket-id">${task.id}</span>
                <span class="tag ${task.severity}">${task.severity}</span>
            </div>
        `;

        // Attach drag events directly to the card as it is created
        card.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', task.id);
            // setTimeout ensures the ghost image is created before making the original transparent
            setTimeout(() => card.style.opacity = '0.5', 0);
        });

        card.addEventListener('dragend', () => {
            card.style.opacity = '1';
        });

        return card;
    }

    saveState() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    }

    /* =====================================================================
       DRAG AND DROP HANDLERS
       ===================================================================== */

    handleDragOver(event, column) {
        // Prevent default is strictly required by the browser to allow dropping
        event.preventDefault(); 
        column.classList.add('drag-over');
    }

    handleDragLeave(event, column) {
        column.classList.remove('drag-over');
    }

    handleDrop(event, column) {
        event.preventDefault();
        column.classList.remove('drag-over');
        
        const draggedTaskId = event.dataTransfer.getData('text/plain');
        const targetStatus = column.dataset.status;

        // Find the task in our state array and update its status
        const taskIndex = this.tasks.findIndex(t => t.id === draggedTaskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].status = targetStatus;
            this.saveState();
            
            // Re-render the board to reflect the new state
            this.renderBoard(); 
        }
    }

    /* =====================================================================
       UTILITIES
       ===================================================================== */

    _generateTicketID() {
        return 'TKT-' + Math.floor(1000 + Math.random() * 9000);
    }
}

// Initialize application safely once the DOM is fully constructed
>>>>>>> 86ccf883545918f517a26fd12de68081c5c889c3
document.addEventListener('DOMContentLoaded', () => new QADashboard());