document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.overlay-title').forEach(title => {
        const text = title.textContent;
        title.textContent = '';
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${i * 0.07}s`;
            title.appendChild(span);
        });
    });
});
