// DAO Frontend JavaScript
class DAOApp {
    constructor() {
        this.isWalletConnected = false;
        this.userAddress = null;
        this.userTokens = 2456;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        this.startAnimations();
    }

    setupEventListeners() {
        // Navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(link);
            });
        });

        // Wallet connection
        const connectWalletBtn = document.querySelector('.connect-wallet');
        connectWalletBtn.addEventListener('click', () => {
            this.connectWallet();
        });

        // Proposal creation
        const createProposalBtn = document.querySelector('.create-proposal-btn');
        createProposalBtn.addEventListener('click', () => {
            this.openProposalModal();
        });

        // Modal handling
        const modal = document.getElementById('proposal-modal');
        const closeModal = document.querySelector('.close-modal');
        const cancelBtn = document.querySelector('.cancel-btn');
        
        closeModal.addEventListener('click', () => {
            this.closeProposalModal();
        });
        
        cancelBtn.addEventListener('click', () => {
            this.closeProposalModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeProposalModal();
            }
        });

        // Proposal form submission
        const proposalForm = document.querySelector('.proposal-form');
        proposalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitProposal();
        });

        // Voting buttons
        const voteButtons = document.querySelectorAll('.vote-btn');
        voteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleVote(e.target);
            });
        });

        // Smooth scrolling for navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }

    handleNavigation(clickedLink) {
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        clickedLink.classList.add('active');
        
        // Scroll to section
        const targetId = clickedLink.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    async connectWallet() {
        const connectBtn = document.querySelector('.connect-wallet');
        
        // Simulate wallet connection
        connectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        
        try {
            // Simulate async wallet connection
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.isWalletConnected = true;
            this.userAddress = '0x1234...5678';
            
            connectBtn.innerHTML = '<i class="fas fa-check"></i> Connected';
            connectBtn.style.background = 'rgba(34, 197, 94, 0.3)';
            
            this.showNotification('Wallet connected successfully!', 'success');
            this.updateUI();
            
        } catch (error) {
            connectBtn.innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
            this.showNotification('Failed to connect wallet', 'error');
        }
    }

    openProposalModal() {
        if (!this.isWalletConnected) {
            this.showNotification('Please connect your wallet first', 'warning');
            return;
        }
        
        const modal = document.getElementById('proposal-modal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeProposalModal() {
        const modal = document.getElementById('proposal-modal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset form
        const form = document.querySelector('.proposal-form');
        form.reset();
    }

    async submitProposal() {
        const title = document.getElementById('proposal-title').value;
        const description = document.getElementById('proposal-description').value;
        const category = document.getElementById('proposal-category').value;
        const duration = document.getElementById('voting-duration').value;

        if (!title || !description) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
        submitBtn.disabled = true;

        try {
            // Simulate proposal creation
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('Proposal created successfully!', 'success');
            this.closeProposalModal();
            this.addNewProposal({ title, description, category, duration });
            
        } catch (error) {
            this.showNotification('Failed to create proposal', 'error');
        } finally {
            submitBtn.innerHTML = '<i class="fas fa-plus"></i> Create Proposal';
            submitBtn.disabled = false;
        }
    }

    addNewProposal(proposalData) {
        const proposalsGrid = document.querySelector('.proposals-grid');
        const newProposalId = `DAO-${String(Date.now()).slice(-3)}`;
        
        const proposalCard = document.createElement('div');
        proposalCard.className = 'proposal-card glass';
        proposalCard.innerHTML = `
            <div class="proposal-header">
                <div class="proposal-status pending">Pending</div>
                <div class="proposal-id">#${newProposalId}</div>
            </div>
            <h3>${proposalData.title}</h3>
            <p>${proposalData.description}</p>
            <div class="proposal-stats">
                <div class="voting-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="progress-labels">
                        <span>0% For</span>
                        <span>100% Pending</span>
                    </div>
                </div>
                <div class="proposal-meta">
                    <span><i class="fas fa-clock"></i> ${proposalData.duration} days left</span>
                    <span><i class="fas fa-users"></i> 0 votes</span>
                </div>
            </div>
            <div class="proposal-actions">
                <button class="vote-btn vote-for glass-button">
                    <i class="fas fa-thumbs-up"></i>
                    Vote For
                </button>
                <button class="vote-btn vote-against glass-button">
                    <i class="fas fa-thumbs-down"></i>
                    Vote Against
                </button>
            </div>
        `;
        
        proposalsGrid.insertBefore(proposalCard, proposalsGrid.firstChild);
        
        // Add event listeners to new vote buttons
        const voteButtons = proposalCard.querySelectorAll('.vote-btn');
        voteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleVote(e.target);
            });
        });
        
        // Animate in
        proposalCard.style.opacity = '0';
        proposalCard.style.transform = 'translateY(20px)';
        setTimeout(() => {
            proposalCard.style.transition = 'all 0.5s ease';
            proposalCard.style.opacity = '1';
            proposalCard.style.transform = 'translateY(0)';
        }, 100);
    }

    async handleVote(button) {
        if (!this.isWalletConnected) {
            this.showNotification('Please connect your wallet first', 'warning');
            return;
        }

        const isVoteFor = button.classList.contains('vote-for');
        const proposalCard = button.closest('.proposal-card');
        const proposalId = proposalCard.querySelector('.proposal-id').textContent;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Voting...';
        button.disabled = true;

        try {
            // Simulate voting transaction
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.showNotification(`Vote cast successfully for ${proposalId}!`, 'success');
            this.updateProposalVotes(proposalCard, isVoteFor);
            
        } catch (error) {
            this.showNotification('Failed to cast vote', 'error');
        } finally {
            const icon = isVoteFor ? 'fa-thumbs-up' : 'fa-thumbs-down';
            const text = isVoteFor ? 'Vote For' : 'Vote Against';
            button.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
            button.disabled = false;
        }
    }

    updateProposalVotes(proposalCard, isVoteFor) {
        const progressFill = proposalCard.querySelector('.progress-fill');
        const progressLabels = proposalCard.querySelector('.progress-labels');
        const voteCount = proposalCard.querySelector('.proposal-meta span:last-child');
        
        // Simulate vote update
        const currentWidth = parseInt(progressFill.style.width) || 0;
        const newWidth = isVoteFor ? Math.min(currentWidth + 5, 100) : Math.max(currentWidth - 5, 0);
        
        progressFill.style.width = `${newWidth}%`;
        progressLabels.innerHTML = `
            <span>${newWidth}% For</span>
            <span>${100 - newWidth}% Against</span>
        `;
        
        const currentVotes = parseInt(voteCount.textContent.match(/\d+/)[0]);
        voteCount.innerHTML = `<i class="fas fa-users"></i> ${currentVotes + 1} votes`;
    }

    updateUI() {
        if (this.isWalletConnected) {
            // Update voting power display
            const powerValue = document.querySelector('.power-value');
            if (powerValue) {
                powerValue.textContent = this.userTokens.toLocaleString();
            }
        }
    }

    startAnimations() {
        // Animate stats on scroll
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStats(entry.target);
                }
            });
        }, observerOptions);

        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach(item => observer.observe(item));

        // Animate treasury values
        const treasuryCards = document.querySelectorAll('.treasury-card');
        treasuryCards.forEach(card => observer.observe(card));
    }

    animateStats(element) {
        const statValue = element.querySelector('.stat-value, .treasury-value');
        if (!statValue || statValue.dataset.animated) return;
        
        statValue.dataset.animated = 'true';
        const finalValue = statValue.textContent;
        const numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
        const prefix = finalValue.match(/[^0-9.]/g)?.[0] || '';
        
        let currentValue = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            
            if (finalValue.includes('M')) {
                statValue.textContent = `${prefix}${(currentValue / 1000000).toFixed(1)}M`;
            } else if (finalValue.includes('K')) {
                statValue.textContent = `${prefix}${(currentValue / 1000).toFixed(0)}K`;
            } else {
                statValue.textContent = `${prefix}${Math.floor(currentValue).toLocaleString()}`;
            }
        }, 20);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content glass">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            padding: 15px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: white;
            min-width: 300px;
            ${type === 'success' ? 'border-left: 4px solid #22c55e;' : ''}
            ${type === 'error' ? 'border-left: 4px solid #ef4444;' : ''}
            ${type === 'warning' ? 'border-left: 4px solid #fbbf24;' : ''}
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.closeNotification(notification);
        });

        // Auto close after 5 seconds
        setTimeout(() => {
            this.closeNotification(notification);
        }, 5000);
    }

    closeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Simulate real-time data updates
    startDataUpdates() {
        setInterval(() => {
            this.updateTreasuryData();
            this.updateProposalData();
        }, 30000); // Update every 30 seconds
    }

    updateTreasuryData() {
        const treasuryValue = document.querySelector('.treasury-card .treasury-value');
        if (treasuryValue) {
            const currentValue = parseFloat(treasuryValue.textContent.replace(/[^0-9.]/g, ''));
            const change = (Math.random() - 0.5) * 0.02; // ±1% change
            const newValue = currentValue * (1 + change);
            treasuryValue.textContent = `$${(newValue / 1000000).toFixed(1)}M`;
        }
    }

    updateProposalData() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const currentWidth = parseInt(bar.style.width) || 0;
            const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            const newWidth = Math.max(0, Math.min(100, currentWidth + change));
            bar.style.width = `${newWidth}%`;
            
            const labels = bar.parentNode.nextElementSibling;
            if (labels) {
                labels.innerHTML = `
                    <span>${newWidth}% For</span>
                    <span>${100 - newWidth}% Against</span>
                `;
            }
        });
    }
}

// Initialize the DAO app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new DAOApp();
    
    // Start real-time updates after 5 seconds
    setTimeout(() => {
        app.startDataUpdates();
    }, 5000);
});

// Add some interactive hover effects
document.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('glass') && !e.target.classList.contains('navbar')) {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.transition = 'transform 0.3s ease';
    }
});

document.addEventListener('mouseout', (e) => {
    if (e.target.classList.contains('glass') && !e.target.classList.contains('navbar')) {
        e.target.style.transform = 'translateY(0)';
    }
});

// Parallax effect for floating shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.2 + (index * 0.05); // Reduced speed for smoother effect
        const translateY = scrolled * speed;
        shape.style.transform = `translateY(${translateY}px)`;
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('proposal-modal');
        if (modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Enter to submit forms
    if (e.key === 'Enter' && e.ctrlKey) {
        const activeForm = document.querySelector('.proposal-form');
        if (activeForm && document.getElementById('proposal-modal').classList.contains('active')) {
            activeForm.dispatchEvent(new Event('submit'));
        }
    }
});