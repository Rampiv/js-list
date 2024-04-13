// !function (e) { "function" != typeof e.matches && (e.matches = e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || function (e) { for (var t = this, o = (t.document || t.ownerDocument).querySelectorAll(e), n = 0; o[n] && o[n] !== t;)++n; return Boolean(o[n]) }), "function" != typeof e.closest && (e.closest = function (e) { for (var t = this; t && 1 === t.nodeType;) { if (t.matches(e)) return t; t = t.parentNode } return null }) }(window.Element.prototype);

(function () {
    // все кнопки
    // кнопки модального окна
    const modalButtonOpen = document.querySelector('#js-open-modal');
    const overlay = document.querySelector('#overlay-modal');
    const modalButtonClose = document.querySelector('#js-modal-close');
    const modalButtonCansel = document.querySelector('#modalButtonCansel')
    const modalWindow = document.querySelector('#modal');
    const inputSurname = document.querySelector('#inputSurname');
    const inputName = document.querySelector('#inputName');
    const inputMiddlename = document.querySelector('#inputMiddlename');
    const modalButtonAddContact = document.querySelector('#btnAddContact');
    const modalSelectContainer = document.querySelector('#modalselectcontainer');
    // кнопки main страницы

    initModalWindow();

    function initModalWindow() {
        // функция открытия/закрытия модального окна
        function toggleModal(shouldOpen) {
            if (shouldOpen) {
                modalWindow.classList.add('active');
                overlay.classList.add('active');
            }
            else {
                modalWindow.classList.remove('active');
                overlay.classList.remove('active');
            }
        }

        modalButtonOpen.addEventListener('click', (e) => {
            toggleModal(true);
        });

        modalButtonClose.addEventListener('click', (e) => {
            toggleModal(false);
        });

        modalButtonCansel.addEventListener('click', (e) => {
            toggleModal(false);
        });

    }

    // функция добавления контактов
    modalButtonAddContact.addEventListener('click', function (e) {
        const div = document.createElement('div');
        const select = document.createElement('select');

        // функция добавления option
        function createOptionElements(options) {
            return options.map(option => {
                const { label, value } = option;

                const optionElem = document.createElement('option');
                optionElem.classList.add('selectblock__option');
                optionElem.innerHTML = label;
                optionElem.setAttribute('value', value);

                return optionElem
            })
        }

        const options = [
            {
                label: 'Телефон',
                value: 'phone'
            },
            {
                label: 'Доп.телефон',
                value: 'phone2'
            },
            {
                label: 'Email',
                value: 'Email'
            },
            {
                label: 'VK',
                value: 'vk'
            },
            {
                label: 'FaceBook',
                value: 'FaceBook'
            }
        ]

        const input = document.createElement('input');
        const button = document.createElement('button');
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        div.classList.add('selectblock', 'flex');
        select.classList.add('selectblock__select');
        select.setAttribute('name', 'contact');
        input.classList.add('selectblock__input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Введите данные контакта');
        button.classList.add('btn-reset', 'selectblock__clear-btn');
        svg.setAttribute('width', '12');
        svg.setAttribute('height', '12');
        svg.setAttributeNS('viewBox', 'viewBox', '0 0 12 12');
        svg.setAttributeNS(null, 'fill', 'none');
        svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg');
        path.setAttributeNS(null, 'd', 'M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z');
        path.setAttributeNS(null, 'fill', '#B0B0B0');

        modalSelectContainer.append(div);
        div.append(select, input, button);
        const optionElements = createOptionElements(options);
        select.append(...optionElements);
        button.append(svg);
        svg.append(path);

        // событие input в добавлении контакта
        let modalSelectBlockInputArray = modalSelectContainer.querySelectorAll(".selectblock__input");
        modalSelectBlockInputArray.forEach(elem => elem.addEventListener("input", function (e) {
            let modalSelectBlockButtonClear = elem.nextSibling;
            toggleVisible(modalSelectBlockButtonClear, !!e.target.value);
        })
        );
        // событие очистить input в добавлении контакта
        let modalSelectBlockButtonClearArray = modalSelectContainer.querySelectorAll(".selectblock__clear-btn");
        modalSelectBlockButtonClearArray.forEach(elem => elem.addEventListener('click', function (e) {
            let modalSelectBlockInput = elem.previousSibling;
            clearInput(modalSelectBlockInput, elem);
        }));
    })

    // функция добавления кнопки очистки контактов
    function toggleVisible(node, shouldShow) {
        if (shouldShow) {
            node.style.display = 'block';  
            tippy(node, {
                content: 'Удалить контакт',
                allowHTML: true,
              });          
        } else {
            node.style.display = 'none';
        }
    };

    // функция очистки input ввода контактов
    function clearInput(inputNode, clearButton) {
        inputNode.value = '';
        toggleVisible(clearButton, false);
    }
})()