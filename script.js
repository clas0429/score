// 模擬的學生資料庫
const studentsData = {
    "123456": {
        name: "王小明",
        scores: {
            "國文": 85,
            "英文": 78,
            "數學": 92,
            "自然": 88,
            "社會": 75
        }
    },
    "654321": {
        name: "林小華",
        scores: {
            "國文": 70,
            "英文": 85,
            "數學": 75,
            "自然": 80,
            "社會": 90
        }
    }
    // 可以添加更多學生資料
};

const studentIdInput = document.getElementById('studentId');
const loginButton = document.getElementById('loginButton');
const loginMessage = document.getElementById('loginMessage');
const loginSection = document.getElementById('login-section');
const resultsSection = document.getElementById('results-section');
const scoreTableBody = document.getElementById('scoreTableBody');
const logoutButton = document.getElementById('logoutButton');

const scoreRadarChartCanvas = document.getElementById('scoreRadarChart');
const scoreLineChartCanvas = document.getElementById('scoreLineChart'); // 新增折線圖 canvas
const scoreBarChartCanvas = document.getElementById('scoreBarChart');   // 新增長條圖 canvas

let radarChart = null; // 用於儲存 Chart 實例
let lineChart = null;  // 用於儲存 Chart 實例
let barChart = null;   // 用於儲存 Chart 實例

// 登入功能
loginButton.addEventListener('click', () => {
    const studentId = studentIdInput.value;
    const student = studentsData[studentId];

    if (student) {
        // 登入成功
        loginMessage.textContent = `歡迎，${student.name}！`;
        loginMessage.style.color = '#27ae60'; // 綠色成功訊息
        loginSection.style.display = 'none';
        resultsSection.style.display = 'block';
        displayScores(student.scores);
        drawAllCharts(student.scores); // 呼叫統一的繪圖函式
    } else {
        // 登入失敗
        loginMessage.textContent = '學號錯誤，請重新輸入。';
        loginMessage.style.color = '#e74c3c'; // 紅色錯誤訊息
        studentIdInput.value = ''; // 清空輸入框
    }
});

// 顯示成績表格
function displayScores(scores) {
    scoreTableBody.innerHTML = ''; // 清空舊的成績
    for (const subject in scores) {
        const row = scoreTableBody.insertRow();
        const subjectCell = row.insertCell();
        const scoreCell = row.insertCell();
        subjectCell.textContent = subject;
        scoreCell.textContent = scores[subject];
    }
}

// 統一繪製所有圖表
function drawAllCharts(scores) {
    drawRadarChart(scores);
    drawLineChart(scores);
    drawBarChart(scores);
}

// 繪製雷達圖
function drawRadarChart(scores) {
    if (radarChart) {
        radarChart.destroy();
    }

    const subjects = Object.keys(scores);
    const scoreValues = Object.values(scores);

    radarChart = new Chart(scoreRadarChartCanvas, {
        type: 'radar',
        data: {
            labels: subjects,
            datasets: [{
                label: '科目成績',
                data: scoreValues,
                backgroundColor: 'rgba(52, 152, 219, 0.4)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(41, 128, 185, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(41, 128, 185, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { display: true },
                    grid: { color: 'rgba(200, 200, 200, 0.2)' },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    pointLabels: {
                        font: { size: 14 }
                    },
                    ticks: {
                        stepSize: 20,
                        backdropColor: 'rgba(255, 255, 255, 0.7)',
                        font: { size: 12 }
                    }
                }
            },
            plugins: {
                legend: { display: true, position: 'top', labels: { font: { size: 14 } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} 分`;
                        }
                    }
                },
                datalabels: {
                    display: true,
                    color: '#333',
                    font: { weight: 'bold' },
                    formatter: function(value, context) {
                        return value;
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

// 繪製折線圖 (Line Chart)
function drawLineChart(scores) {
    if (lineChart) {
        lineChart.destroy();
    }

    const subjects = Object.keys(scores);
    const scoreValues = Object.values(scores);

    lineChart = new Chart(scoreLineChartCanvas, {
        type: 'line',
        data: {
            labels: subjects,
            datasets: [{
                label: '科目成績',
                data: scoreValues,
                fill: false, // 不填充線下方區域
                borderColor: 'rgb(75, 192, 192)', // 青色
                tension: 0.1, // 線條弧度
                pointBackgroundColor: 'rgb(75, 192, 192)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(75, 192, 192)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} 分`;
                        }
                    }
                },
                datalabels: {
                    display: true,
                    color: '#333',
                    align: 'end', // 讓數字顯示在點的上方
                    anchor: 'end',
                    font: { weight: 'bold' },
                    formatter: function(value, context) {
                        return value;
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

// 繪製長條圖 (Bar Chart)
function drawBarChart(scores) {
    if (barChart) {
        barChart.destroy();
    }

    const subjects = Object.keys(scores);
    const scoreValues = Object.values(scores);

    barChart = new Chart(scoreBarChartCanvas, {
        type: 'bar',
        data: {
            labels: subjects,
            datasets: [{
                label: '科目成績',
                data: scoreValues,
                backgroundColor: [ // 可以為每個長條設定不同顏色
                    'rgba(255, 99, 132, 0.6)', // 紅色
                    'rgba(54, 162, 235, 0.6)', // 藍色
                    'rgba(255, 206, 86, 0.6)', // 黃色
                    'rgba(75, 192, 192, 0.6)', // 青色
                    'rgba(153, 102, 255, 0.6)'  // 紫色
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} 分`;
                        }
                    }
                },
                datalabels: {
                    display: true,
                    color: '#333',
                    anchor: 'end', // 數字顯示在長條上方
                    align: 'top',
                    font: { weight: 'bold' },
                    formatter: function(value, context) {
                        return value;
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

// 登出功能
logoutButton.addEventListener('click', () => {
    loginSection.style.display = 'block';
    resultsSection.style.display = 'none';
    loginMessage.textContent = '';
    studentIdInput.value = '';
    
    // 登出時銷毀所有圖表
    if (radarChart) {
        radarChart.destroy();
        radarChart = null;
    }
    if (lineChart) {
        lineChart.destroy();
        lineChart = null;
    }
    if (barChart) {
        barChart.destroy();
        barChart = null;
    }
});
