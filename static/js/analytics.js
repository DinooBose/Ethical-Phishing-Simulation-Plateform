
// Analytics Dashboard Charts and Data Visualization
document.addEventListener('DOMContentLoaded', function() {
    initializeAnalyticsCharts();
    setupAnalyticsInteractions();
});

function initializeAnalyticsCharts() {
    // Performance Comparison Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        createPerformanceChart(performanceCtx);
    }

    // Distribution Chart
    const distributionCtx = document.getElementById('distributionChart');
    if (distributionCtx) {
        createDistributionChart(distributionCtx);
    }

    // Load additional analytics data
    loadAnalyticsData();
}

function createPerformanceChart(ctx) {
    const analyticsData = getAnalyticsDataFromPage();
    
    const chartConfig = {
        type: 'line',
        data: {
            labels: analyticsData.map(d => d.campaign.length > 20 ? d.campaign.substring(0, 20) + '...' : d.campaign),
            datasets: [
                {
                    label: 'Open Rate (%)',
                    data: analyticsData.map(d => d.openRate),
                    borderColor: 'rgba(23, 162, 184, 1)',
                    backgroundColor: 'rgba(23, 162, 184, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(23, 162, 184, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Click Rate (%)',
                    data: analyticsData.map(d => d.clickRate),
                    borderColor: 'rgba(255, 193, 7, 1)',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(255, 193, 7, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Success Rate (%)',
                    data: analyticsData.map(d => d.successRate),
                    borderColor: 'rgba(220, 53, 69, 1)',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(220, 53, 69, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
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
                    text: 'Campaign Performance Trends',
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
                        afterBody: function(tooltipItems) {
                            const dataIndex = tooltipItems[0].dataIndex;
                            const data = analyticsData[dataIndex];
                            return [
                                '',
                                `Total Targets: ${data.totalTargets}`,
                                `Risk Level: ${getRiskLevel(data.successRate)}`
                            ];
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
                        maxRotation: 45,
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
                duration: 2000,
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

function createDistributionChart(ctx) {
    const analyticsData = getAnalyticsDataFromPage();
    
    // Calculate overall statistics
    const totalCampaigns = analyticsData.length;
    const avgOpenRate = analyticsData.reduce((sum, d) => sum + d.openRate, 0) / totalCampaigns || 0;
    const avgClickRate = analyticsData.reduce((sum, d) => sum + d.clickRate, 0) / totalCampaigns || 0;
    const avgSuccessRate = analyticsData.reduce((sum, d) => sum + d.successRate, 0) / totalCampaigns || 0;
    const totalTargets = analyticsData.reduce((sum, d) => sum + d.totalTargets, 0);

    const chartConfig = {
        type: 'radar',
        data: {
            labels: [
                'Email Delivery',
                'Open Rate',
                'Click Rate', 
                'Success Rate',
                'User Awareness',
                'Security Score'
            ],
            datasets: [{
                label: 'Current Performance',
                data: [
                    95, // Assume good delivery rate
                    avgOpenRate,
                    avgClickRate,
                    avgSuccessRate,
                    Math.max(0, 100 - avgSuccessRate), // Inverse of success rate
                    Math.max(0, 100 - (avgSuccessRate * 1.2)) // Security score
                ],
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 3,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }, {
                label: 'Target Performance',
                data: [98, 70, 30, 5, 95, 90], // Target values
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 2,
                borderDash: [5, 5],
                pointBackgroundColor: 'rgba(40, 167, 69, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4
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
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Security Awareness Metrics',
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
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.r.toFixed(1)}%`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    pointLabels: {
                        font: {
                            family: 'Inter, sans-serif',
                            size: 11,
                            weight: '500'
                        }
                    },
                    ticks: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutCubic'
            }
        }
    };

    new Chart(ctx, chartConfig);
}

function getAnalyticsDataFromPage() {
    const analyticsData = [];
    const tableRows = document.querySelectorAll('#analyticsTable tbody tr, table tbody tr');
    
    tableRows.forEach(row => {
        const campaignCell = row.querySelector('td:first-child h6, td:first-child');
        const targetsCell = row.querySelector('td:nth-child(2)');
        const openRateProgress = row.querySelector('td:nth-child(6) .progress-bar, td:nth-child(5) .progress-bar');
        const clickRateProgress = row.querySelector('td:nth-child(7) .progress-bar, td:nth-child(6) .progress-bar');
        const successRateProgress = row.querySelector('td:nth-child(8) .progress-bar, td:nth-child(7) .progress-bar');
        
        if (campaignCell) {
            const campaignName = campaignCell.textContent.trim();
            const totalTargets = targetsCell ? parseInt(targetsCell.textContent.trim()) || 0 : 0;
            
            // Extract rates from progress bars or text
            let openRate = 0, clickRate = 0, successRate = 0;
            
            if (openRateProgress) {
                const rateText = openRateProgress.parentElement.nextElementSibling;
                openRate = rateText ? parseFloat(rateText.textContent.replace('%', '')) : 0;
            }
            
            if (clickRateProgress) {
                const rateText = clickRateProgress.parentElement.nextElementSibling;
                clickRate = rateText ? parseFloat(rateText.textContent.replace('%', '')) : 0;
            }
            
            if (successRateProgress) {
                const rateText = successRateProgress.parentElement.nextElementSibling;
                successRate = rateText ? parseFloat(rateText.textContent.replace('%', '')) : 0;
            }

            analyticsData.push({
                campaign: campaignName,
                totalTargets,
                openRate,
                clickRate,
                successRate
            });
        }
    });

    // If no data found, return sample data for demo
    if (analyticsData.length === 0) {
        return [
            { campaign: 'No Data Available', totalTargets: 0, openRate: 0, clickRate: 0, successRate: 0 }
        ];
    }

    return analyticsData;
}

function getRiskLevel(successRate) {
    if (successRate > 30) return '🔴 High Risk';
    if (successRate > 15) return '🟡 Medium Risk';
    if (successRate > 5) return '🟠 Low Risk';
    return '🟢 Secure';
}

function setupAnalyticsInteractions() {
    // Add export functionality
    const exportBtn = document.querySelector('#exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportAnalyticsData);
    }

    // Add filter functionality
    setupAnalyticsFilters();
    
    // Add real-time updates
    setInterval(refreshAnalyticsData, 60000); // Refresh every minute
}

function exportAnalyticsData() {
    const analyticsData = getAnalyticsDataFromPage();
    const csvContent = convertToCSV(analyticsData);
    downloadCSV(csvContent, 'phishing_analytics.csv');
}

function convertToCSV(data) {
    const headers = ['Campaign', 'Total Targets', 'Open Rate (%)', 'Click Rate (%)', 'Success Rate (%)'];
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
        const values = [
            `"${row.campaign}"`,
            row.totalTargets,
            row.openRate.toFixed(1),
            row.clickRate.toFixed(1),
            row.successRate.toFixed(1)
        ];
        csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function setupAnalyticsFilters() {
    // Add date range filter if elements exist
    const dateFromInput = document.querySelector('#dateFrom');
    const dateToInput = document.querySelector('#dateTo');
    const campaignSelect = document.querySelector('#campaignFilter');
    
    if (dateFromInput && dateToInput) {
        dateFromInput.addEventListener('change', filterAnalyticsData);
        dateToInput.addEventListener('change', filterAnalyticsData);
    }
    
    if (campaignSelect) {
        campaignSelect.addEventListener('change', filterAnalyticsData);
    }
}

function filterAnalyticsData() {
    // Implement filtering logic based on selected criteria
    const tableRows = document.querySelectorAll('table tbody tr');
    const dateFrom = document.querySelector('#dateFrom')?.value;
    const dateTo = document.querySelector('#dateTo')?.value;
    const selectedCampaign = document.querySelector('#campaignFilter')?.value;
    
    tableRows.forEach(row => {
        let visible = true;
        
        // Apply campaign filter
        if (selectedCampaign && selectedCampaign !== 'all') {
            const campaignName = row.querySelector('td:first-child')?.textContent.trim();
            visible = visible && campaignName.toLowerCase().includes(selectedCampaign.toLowerCase());
        }
        
        // Apply date filters (if date columns exist)
        // This would need to be implemented based on actual date columns in the table
        
        row.style.display = visible ? '' : 'none';
    });
}

function refreshAnalyticsData() {
    // Add subtle animation to indicate data refresh
    const cards = document.querySelectorAll('.cyber-card');
    cards.forEach(card => {
        card.style.opacity = '0.8';
        setTimeout(() => {
            card.style.opacity = '1';
        }, 300);
    });
}

function loadAnalyticsData() {
    // Load additional analytics data via the API endpoint if available
    fetch('/analytics/api/data')
        .then(response => response.json())
        .then(data => {
            updateChartsWithApiData(data);
        })
        .catch(error => {
            console.log('Analytics API not available, using page data');
        });
}

function updateChartsWithApiData(data) {
    // Update charts with fresh data from API
    const performanceCtx = document.getElementById('performanceChart');
    const distributionCtx = document.getElementById('distributionChart');
    
    if (performanceCtx && data.campaign_names && data.campaign_names.length > 0) {
        const chart = Chart.getChart(performanceCtx);
        if (chart) {
            chart.data.labels = data.campaign_names;
            chart.data.datasets[0].data = data.open_rates || [];
            chart.data.datasets[1].data = data.click_rates || [];
            chart.data.datasets[2].data = data.success_rates || [];
            chart.update('active');
        }
    }
}

// Initialize Feather icons
document.addEventListener('DOMContentLoaded', function() {
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});

// Export functions for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAnalyticsCharts,
        createPerformanceChart,
        createDistributionChart,
        getAnalyticsDataFromPage,
        exportAnalyticsData
    };
}
