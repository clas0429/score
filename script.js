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
let radarChart = null; // 用於儲存 Chart 實例，以便更新或銷毀

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
        drawRadarChart(student.scores);
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

// 繪製雷達圖
function drawRadarChart(scores) {
    if (radarChart) {
        radarChart.destroy(); // 如果圖表已存在，先銷毀它
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
                backgroundColor: 'rgba(52, 152, 219, 0.4)', // 藍色半透明填充
                borderColor: 'rgba(52, 152, 219, 1)', // 藍色邊框
                borderWidth: 2,
                pointBackgroundColor: 'rgba(41, 128, 185, 1)', // 藍色點
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
                    angleLines: {
                        display: true
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)' // 網格線顏色
                    },
                    suggestedMin: 0, // 最低分數
                    suggestedMax: 100, // 最高分數
                    pointLabels: {
                        font: {
                            size: 14 // 科目名稱字體大小
                        }
                    },
                    ticks: {
                        stepSize: 20, // 刻度間距
                        backdropColor: 'rgba(255, 255, 255, 0.7)', // 刻度背景色
                        font: {
                            size: 12 // 刻度數字字體大小
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} 分`;
                        }
                    }
                },
                datalabels: { // 使用 chartjs-plugin-datalabels 顯示分數
                    display: true,
                    color: '#333',
                    font: {
                        weight: 'bold'
                    },
                    formatter: function(value, context) {
                        return value;
                    }
                }
            }
        },
        plugins: [ChartDataLabels] // 註冊 datalabels 插件
    });
}

// 登出功能
logoutButton.addEventListener('click', () => {
    loginSection.style.display = 'block';
    resultsSection.style.display = 'none';
    loginMessage.textContent = ''; // 清空訊息
    studentIdInput.value = ''; // 清空學號輸入
    if (radarChart) {
        radarChart.destroy(); // 登出時銷毀圖表
    }
});