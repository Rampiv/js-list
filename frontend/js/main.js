// !function (e) { "function" != typeof e.matches && (e.matches = e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || function (e) { for (var t = this, o = (t.document || t.ownerDocument).querySelectorAll(e), n = 0; o[n] && o[n] !== t;)++n; return Boolean(o[n]) }), "function" != typeof e.closest && (e.closest = function (e) { for (var t = this; t && 1 === t.nodeType;) { if (t.matches(e)) return t; t = t.parentNode } return null }) }(window.Element.prototype);

(function () {
    const modalButtons = document.querySelector('#js-open-modal');
    const overlay = document.querySelector('#overlay-modal');
    const closeButtons = document.querySelector('#js-modal-close');
    const modalElem = document.querySelector('.modal');
    const inputSurname = document.querySelector('#inputSurname');
    const inputName = document.querySelector('#inputName');
    const inputMiddlename = document.querySelector('#inputMiddlename');
    const btnAddContact = document.querySelector('#btnAddContact');
    const selectblockContainer = document.getElementById('selectblockcontainer');
    const addContactInput = document.querySelector('.selectblock__input');
    const addContactClear = document.querySelector('.selectblock__clear-btn');

    // tooltip
    tippy('[data-tippy-content]');

    modalButtons.addEventListener('click', function (e) {
        e.preventDefault();
        modalElem.classList.add('active');
        overlay.classList.add('active');
    })

    closeButtons.addEventListener('click', function () {
        let parentModal = this.closest('.modal');
        parentModal.classList.remove('active');
        overlay.classList.remove('active');
    })

    // функция добавления контактов
    btnAddContact.addEventListener('click', function (e) {
        e.preventDefault();
        const div = document.createElement('div');
        const select = document.createElement('select');
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        const option3 = document.createElement('option');
        const option4 = document.createElement('option');
        const option5 = document.createElement('option');
        const input = document.createElement('input');
        const button = document.createElement('button');
        const selectblock = document.createElement('div');
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        div.classList.add('selectblock', 'flex');
        select.classList.add('selectblock__select');
        select.setAttribute('name', 'contact');
        option1.classList.add('selectblock__option');
        option1.innerHTML = 'Телефон';
        option1.setAttribute('value', 'phone');
        option2.classList.add('selectblock__option');
        option2.innerHTML = 'Доп.телефон';
        option2.setAttribute('value', 'phone2');
        option3.classList.add('selectblock__option');
        option3.innerHTML = 'Email';
        option3.setAttribute('value', 'Email');
        option4.classList.add('selectblock__option');
        option4.innerHTML = 'VK';
        option4.setAttribute('value', 'vk');
        option5.classList.add('selectblock__option');
        option5.innerHTML = 'FaceBook';
        option5.setAttribute('value', 'FaceBook');
        input.classList.add('selectblock__input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Введите данные контакта');
        selectblock.classList.add('selectblock__btn-block');
        button.classList.add('btn-reset', 'selectblock__clear-btn');
        button.setAttributeNS(null, 'data-tippy-content', 'Удалить контакт');
        svg.setAttribute('width', '12');
        svg.setAttribute('height', '12');
        svg.setAttributeNS('viewBox', 'viewBox', '0 0 12 12');
        svg.setAttributeNS(null, 'fill', 'none');
        svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg');
        path.setAttributeNS(null, 'd', 'M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z');
        path.setAttributeNS(null, 'fill', '#B0B0B0');

        selectblockContainer.append(div);
        div.append(select, input, selectblock);
        select.append(option1, option2, option3, option4, option5);
        selectblock.append(button);
        button.append(svg);
        svg.append(path);
    })

    // функция добавления кнопки очистки контактов
    addContactInput.addEventListener('click', function (e) {
        e.preventDefault();
        if (addContactInput.value) {
            document.querySelector('.selectblock__btn-block').style.display = 'block';
        } else {
            document.querySelector('.selectblock__btn-block').style.display = 'none';
        }
    })

    // функция очистки input ввода контактов
    addContactClear.addEventListener('click', function (e) {
        e.preventDefault();
        addContactClear.parentElement.parentElement.querySelector('.selectblock__input').value = '';

    })
})()