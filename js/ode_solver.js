function heunMethod({ f, x0, y0, h, x_end }) {
    const steps = [];
    let x = x0;
    let y = y0; 
    let i = 0;

    const tolerance = 1e-9; 

    while (x <= x_end + tolerance) {
        const k1 = f(x, y); 
        const y_predictor = y + h * k1; 
        const k2 = f(x + h, y_predictor); 

        const y_next = y + (h / 2) * (k1 + k2);

        steps.push({ 
            i: i, 
            x: parseFloat(x.toFixed(6)), 
            y: parseFloat(y.toFixed(6)), 
            h: parseFloat(h.toFixed(6)), 
            k1: parseFloat(k1.toFixed(6)), 
            x_next: parseFloat((x + h).toFixed(6)), 
            y_predictor: parseFloat(y_predictor.toFixed(6)), 
            k2: parseFloat(k2.toFixed(6))
        });
        
        y = y_next; 
        x += h; 
        i++;
    }
    return steps;
}

function rk4Method({ f, x0, y0, h, x_end }) {
    const steps = [];
    let x = x0;
    let y = y0; 
    let i = 0;
    const tolerance = 1e-9;

    while (x <= x_end + tolerance) {
        
        const current_x = x;
        const current_y = y;

        
        const K1_val = f(current_x, current_y);
        
        // K2 = f(x + 0.5*h, y + 0.5*K1*h)
        const xK1_val = current_x + (0.5 * h);
        const yK1_val = current_y + (0.5 * K1_val * h);
        const K2_val = f(xK1_val, yK1_val);

        // K3 = f(x + 0.5*h, y + 0.5*K2*h)
        const xK2_val = current_x + (0.5 * h); // Same as xK1_val
        const yK2_val = current_y + (0.5 * K2_val * h);
        const K3_val = f(xK2_val, yK2_val);
        
        // K4 = f(x + h, y + K3*h)
        const xK3_val = current_x + h;
        const yK3_val = current_y + K3_val * h;
        const K4_val = f(xK3_val, yK3_val);

        
        const y_next = current_y + (1 / 6) * (K1_val + 2 * K2_val + 2 * K3_val + K4_val) * h;

        steps.push({
            i: i, 
            x: parseFloat(current_x.toFixed(6)), 
            y: parseFloat(current_y.toFixed(6)), 
            h: parseFloat(h.toFixed(6)), 
            K1: parseFloat(K1_val.toFixed(6)), 
            xK1: parseFloat(xK1_val.toFixed(6)), 
            yK1: parseFloat(yK1_val.toFixed(6)), 
            K2: parseFloat(K2_val.toFixed(6)), 
            xK2: parseFloat(xK2_val.toFixed(6)), 
            yK2: parseFloat(yK2_val.toFixed(6)), 
            K3: parseFloat(K3_val.toFixed(6)), 
            xK3: parseFloat(xK3_val.toFixed(6)), 
            yK3: parseFloat(yK3_val.toFixed(6)), 
            K4: parseFloat(K4_val.toFixed(6))
           
        });

        y = y_next; 
        x += h; 
        i++;
    }
    return steps;
}

function renderTableHeun(steps) {
    const tbody = document.querySelector('#heunTable tbody');
    tbody.innerHTML = ''; 

    steps.forEach((step, index) => {
        const isLast = index === steps.length - 1;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${step.i}</td>
            <td>${step.x.toFixed(2)}</td>
            <td style="${isLast ? 'background-color: #c6f6d5; font-weight: bold;' : ''}">
                ${step.y.toFixed(6)}
            </td>
            <td>${step.k1.toFixed(6)}</td>
            <td>${step.h.toFixed(2)}</td>
            <td>${step.x_next.toFixed(2)}</td>
            <td>${step.y_predictor.toFixed(6)}</td>
            <td>${step.k2.toFixed(6)}</td>
            `;
        tbody.appendChild(row);
    });
}

function renderTableRK4(steps) {
    const tbody = document.querySelector('#rk4Table tbody');
    if (!tbody) {
        console.error("No se encontró el tbody para la tabla de RK4.");
        return;
    }
    tbody.innerHTML = ''; 

    steps.forEach((step, index) => {
        const isLast = index === steps.length - 1;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${step.i}</td>
            <td>${step.x.toFixed(6)}</td>
            <td style="${isLast ? 'background-color: #c6f6d5; font-weight: bold;' : ''}">
                ${step.y.toFixed(6)}
            </td>
            <td>${step.h.toFixed(6)}</td>
            <td>${step.K1.toFixed(6)}</td>
            <td>${step.xK1.toFixed(6)}</td>
            <td>${step.yK1.toFixed(6)}</td>
            <td>${step.K2.toFixed(6)}</td>
            <td>${step.xK2.toFixed(6)}</td>
            <td>${step.yK2.toFixed(6)}</td>
            <td>${step.K3.toFixed(6)}</td>
            <td>${step.xK3.toFixed(6)}</td>
            <td>${step.yK3.toFixed(6)}</td>
            <td>${step.K4.toFixed(6)}</td>
            `;
        tbody.appendChild(row);
    });
}

function renderChart(canvasId, steps, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const data = {
        labels: steps.map(s => s.x),
        datasets: [{
            label,
            data: steps.map(s => s.y), 
            borderColor: canvasId === 'rk4Chart' ? 'rgb(255, 99, 132)' : 'rgb(54, 162, 235)',
            fill: false,
            tension: 0.1
        }]
    };
    const config = {
        type: 'line',
        data,
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `y = ${context.parsed.y.toFixed(6)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'X' 
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Y' 
                    }
                }
            }
        }
    };

    return new Chart(ctx, config);
}