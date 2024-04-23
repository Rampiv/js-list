// !function (e) { "function" != typeof e.matches && (e.matches = e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || function (e) { for (var t = this, o = (t.document || t.ownerDocument).querySelectorAll(e), n = 0; o[n] && o[n] !== t;)++n; return Boolean(o[n]) }), "function" != typeof e.closest && (e.closest = function (e) { for (var t = this; t && 1 === t.nodeType;) { if (t.matches(e)) return t; t = t.parentNode } return null }) }(window.Element.prototype);

(function () {
    // все кнопки
    // кнопки модального окна
    const modalButtonOpen = document.querySelector('#js-open-modal');
    const overlay = document.querySelector('#overlay-modal');
    const modalButtonClose = document.querySelector('#js-modal-close');
    const modalButtonCansel = document.querySelector('#modalButtonCansel')
    const modalWindow = document.querySelector('#modal');
    const modalButtonAddContact = document.querySelector('#btnAddContact');
    const modalSelectContainer = document.querySelector('#modalselectcontainer');

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

    // ивент добавления контактов
    modalButtonAddContact.addEventListener('click', function () {
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
            elem.style.color = '#333';
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

    //
    // ВЗАИМОДЕЙСТВИЕ С СЕРВЕРОМ:
    //

    const inputSurname = document.querySelector('#inputsurname');
    const inputName = document.querySelector('#inputname');
    const inputMiddleName = document.querySelector('#inputmiddlename');
    const modalConactAddArray = [];


    // добавление клиента на сервер
    function getClientsItem() {
        async function createClient() {
            const response = await fetch('http://localhost:3000/api/clients', {
                method: 'POST',
                body: JSON.stringify({
                    name: capFirst(inputName.value).trim(),
                    surname: capFirst(inputSurname.value).trim(),
                    lastName: capFirst(inputMiddleName.value).trim(),
                    contacts: Array.from(modalConactAddArray),
                }),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                }
            });
        }
        createClient();
    }

    // функция добавления контактов в array
    function getContacts() {
        const selectBlockArray = Array.from(document.querySelectorAll('.selectblock'));
        return selectBlockArray.map(elem => {
            const select = elem.querySelector('.selectblock__select');
            const type = select.options[select.selectedIndex].text;
            const value = elem.querySelector('.selectblock__input').value.trim();
            const selectObject = { type, value };
            modalConactAddArray.push(selectObject);
        }
        );
    }

    // функция очиски array
    function clearArray(array) {
        array.length = 0;
    }

    // ивент добавления на сервер клиента
    const modalButtonSave = document.querySelector('#modalButtonSave');

    modalButtonSave.addEventListener('click', function (e) {
        e.preventDefault();
        clearArray(modalConactAddArray);
        getContacts();
        getClientsItem();


    })

    // функция отрисовки с сервера
    const table = document.querySelector('.table');

    async function renderClients(array) {
        array.forEach(obj => {
            const tr = document.createElement('tr');
            const id = document.createElement('td');
            const fio = document.createElement('td');
            const create = document.createElement('td');
            const change = document.createElement('td');
            const contacts = document.createElement('td');
            const btns = document.createElement('td');
            const date = document.createElement('div');
            const time = document.createElement('div');
            const btnEdit = document.createElement('button');
            const btnDelete = document.createElement('button');

            tr.classList.add('table__body');
            id.classList.add('table__id-width', 'table__body-common', 'color-grey');
            fio.classList.add('table__fio-width', 'table__body-common');
            create.classList.add('table__create-width', 'table__body-common');
            change.classList.add('table__change-width', 'table__body-common');
            date.classList.add('table__body-date');
            time.classList.add('table__body-time', 'color-grey');
            contacts.classList.add('table__contacts-width', 'table__body-common');
            btns.classList.add('table__actions', 'table__body-common', 'flex');
            btnEdit.classList.add('btn-reset', 'table__btn-edit');
            btnDelete.classList.add('btn-reset', 'table__btn-delete');

            // сокращение id
            if (obj.id.length > 6) {
                id.textContent = obj.id.substring(0, 4) + '...';
                tippy(id, {
                    content: obj.id,
                    allowHTML: true,
                });
            } else {
                id.textContent = obj.id;
            }

            const fullFio = obj.surname + ' ' + obj.name + ' ' + obj.lastName;
            fio.textContent = fullFio.trim();
            create.textContent = obj.createdAt;
            change.textContent = obj.updatedAt;
            contacts.textContent = obj.contacts;
            // рендер иконок
            


            btnEdit.textContent = 'Изменить';
            btnDelete.textContent = 'Удалить'

            table.append(tr);
            tr.append(id, fio, create, change, contacts, btns)
            create.append(date, time);
            change.append(date, time);
            btns.append(btnEdit, btnDelete);
        })
    }

    async function renderTable() {
        const response = await fetch('http://localhost:3000/api/clients', {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        const clientsList = await response.json();
        renderClients(clientsList);
    }
    renderTable();

    // Функция выравнивания букв
    function capFirst(str) {
        return str[0].toUpperCase() + str.slice(1).toLowerCase();
    }
})()