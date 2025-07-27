// Dashboard Charts and Interactivity
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard charts and interactions
    initializeDashboardCharts();
    setupDashboardInteractions();
});

function initializeDashboardCharts() {
    // Campaign Performance Chart
    const campaignCtx = document.getElementById('campaignChart');
    if (campaignCtx) {
        createCampaignChart(campaignCtx);
    }

    // Success Rate Distribution Chart
    const successCtx = document.getElementById('successChart');
    if (successCtx) {
        createSuccessDistributionChart(successCtx);
    }
}

function createCampaignChart(ctx) {
    // Get campaign data from the page (if available)
    const campaigns = getCampaignDataFromPage();
    
    const chartConfig = {
        type: 'bar',
        data: {
            labels: campaigns.map(c => c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name),
            datasets: [
                {
                    label: 'Success Rate (%)',
                    data: campaigns.map(c => c.successRate),
                    backgroundColor: campaigns.map(c => {
                        if (c.successRate > 30) return 'rgba(220, 53, 69, 0.8)'; // High risk - red
                        if (c.successRate > 15) return 'rgba(255, 193, 7, 0.8)'; // Medium risk - yellow
                        return 'rgba(40, 167, 69, 0.8)'; // Low risk - green
                    }),
                    borderColor: campaigns.map(c => {
                        if (c.successRate > 30) return 'rgba(220, 53, 69, 1)';
                        if (c.successRate > 15) return 'rgba(255, 193, 7, 1)';
                        return 'rgba(40, 167, 69, 1)';
                    }),
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false,
                },
                {
                    label: 'Click Rate (%)',
                    data: campaigns.map(c => c.clickRate || Math.max(0, c.successRate - Math.random() * 10)),
                    backgroundColor: 'rgba(23, 162, 184, 0.6)',
                    borderColor: 'rgba(23, 162, 184, 1)',
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false,
                },
                {
                    label: 'Open Rate (%)',
                    data: campaigns.map(c => c.openRate || Math.max(c.successRate + 10, c.successRate + Math.random() * 20)),
                    backgroundColor: 'rgba(102, 126, 234, 0.6)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            family: 'Inter, sans-serif',
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Campaign Performance Overview',
                    font: {
                        family: 'Inter, sans-serif',
                        size: 16,
                        weight: '600'
                    },
                    padding: 20
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        family: 'Inter, sans-serif',
                        size: 14,
                        weight: '600'
                    },
                    bodyFont: {
                        family: 'Inter, sans-serif',
                        size: 12
                    },
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        afterLabel: function(context) {
                            if (context.datasetIndex === 0) {
                                const rate = context.parsed.y;
                                if (rate > 30) return '🔴 High Risk';
                                if (rate > 15) return '🟡 Medium Risk';
                                return '🟢 Low Risk';
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter, sans-serif',
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        font: {
                            family: 'Inter, sans-serif',
                            size: 11
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutCubic'
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    };

    new Chart(ctx, chartConfig);
}

function createSuccessDistributionChart(ctx) {
    const campaigns = getCampaignDataFromPage();
    
    // Calculate distribution
    const highRisk = campaigns.filter(c => c.successRate > 30).length;
    const mediumRisk = campaigns.filter(c => c.successRate > 15 && c.successRate <= 30).length;
    const lowRisk = campaigns.filter(c => c.successRate > 5 && c.successRate <= 15).length;
    const secure = campaigns.filter(c => c.successRate <= 5).length;

    const chartConfig = {
        type: 'doughnut',
        data: {
            labels: ['High Risk (>30%)', 'Medium Risk (15-30%)', 'Low Risk (5-15%)', 'Secure (≤5%)'],
            datasets: [{
                data: [highRisk, mediumRisk, lowRisk, secure],
                backgroundColor: [
                    '#dc3545', // Red for high risk
                    '#ffc107', // Yellow for medium risk
                    '#17a2b8', // Blue for low risk
                    '#28a745'  // Green for secure
                ],
                borderColor: [
                    '#c82333',
                    '#e0a800',
                    '#138496',
                    '#1e7e34'
                ],
                borderWidth: 3,
                hoverBorderWidth: 4,
                cutout: '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            family: 'Inter, sans-serif',
                            size: 11,
                            weight: '500'
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: `${label}: ${data.datasets[0].data[i]}`,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                strokeStyle: data.datasets[0].borderColor[i],
                                pointStyle: 'circle'
                            }));
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        family: 'Inter, sans-serif',
                        size: 14,
                        weight: '600'
                    },
                    bodyFont: {
                        family: 'Inter, sans-serif',
                        size: 12
                    },
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${label}: ${value} campaigns (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 2000,
                easing: 'easeInOutCubic'
            }
        }
    };

    new Chart(ctx, chartConfig);
}

function getCampaignDataFromPage() {
    // Extract campaign data from the rendered page
    const campaigns = [];
    const campaignRows = document.querySelectorAll('tbody tr');
    
    campaignRows.forEach(row => {
        const nameCell = row.querySelector('td:first-child h6');
        const successRateCell = row.querySelector('.progress-bar');
        
        if (nameCell && successRateCell) {
            const name = nameCell.textContent.trim();
            const successRateText = row.querySelector('.progress-bar').parentElement.nextElementSibling;
            const successRate = successRateText ? parseFloat(successRateText.textContent.replace('%', '')) : 0;
            
            campaigns.push({
                name,
                successRate,
                clickRate: Math.max(0, successRate - Math.random() * 5), // Estimate
                openRate: Math.min(100, successRate + 10 + Math.random() * 15) // Estimate
            });
        }
    });

    // If no campaigns found in table, create sample data for demo
    if (campaigns.length === 0) {
        return [
            { name: 'Sample Campaign', successRate: 0, clickRate: 0, openRate: 0 }
        ];
    }

    return campaigns;
}

function setupDashboardInteractions() {
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.cyber-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click handlers for campaign actions
    const startButtons = document.querySelectorAll('a[href*="start_campaign"]');
    startButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const confirmed = confirm('Are you sure you want to start this phishing simulation campaign? This will send emails to all targeted users.');
            if (!confirmed) {
                e.preventDefault();
            } else {
                // Add loading state
                this.innerHTML = '<i data-feather="loader" class="small me-1"></i>Starting...';
                this.classList.add('loading');
                feather.replace();
            }
        });
    });

    // Add real-time updates simulation
    setInterval(updateDashboardStats, 30000); // Update every 30 seconds
}

function updateDashboardStats() {
    // Simulate real-time updates by adding subtle animations
    const statNumbers = document.querySelectorAll('.card-body h2');
    statNumbers.forEach(stat => {
        stat.style.transform = 'scale(1.05)';
        setTimeout(() => {
            stat.style.transform = 'scale(1)';
        }, 200);
    });
}

// Initialize Feather icons when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});

// Add keyboard shortcuts for dashboard navigation
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'n':
                e.preventDefault();
                window.location.href = '/campaigns/create';
                break;
            case 'a':
                e.preventDefault();
                window.location.href = '/analytics';
                break;
            case 't':
                e.preventDefault();
                window.location.href = '/templates';
                break;
        }
    }
});

// Export functions for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeDashboardCharts,
        createCampaignChart,
        createSuccessDistributionChart,
        getCampaignDataFromPage
    };
}
