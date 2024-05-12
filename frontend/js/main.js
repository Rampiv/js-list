import contactIcon from './assets/icons.js';

(function () {
    // кнопки 
    const modalButtonOpen = document.querySelector('#js-open-modal');
    const overlay = document.querySelector('#overlay-modal');
    const modalButtonClose = document.querySelector('#js-modal-close');
    const modalButtonCansel = document.querySelector('#modalButtonCansel')
    const modalWindow = document.querySelector('#modal');
    const modalButtonAddContact = document.querySelector('#btnAddContact');
    const modalSelectContainer = document.querySelector('#modalselectcontainer');
    const inputSurname = document.querySelector('#inputsurname');
    const inputName = document.querySelector('#inputname');
    const inputMiddleName = document.querySelector('#inputmiddlename');
    const tableBody = document.querySelector('#tableBody')
    const tableId = document.querySelector('#tableId');
    const tableFio = document.querySelector('#tableFio');
    const tableDate = document.querySelector('#tableDate');
    const tableChange = document.querySelector('#tableChange');
    const modalFormInputs = document.querySelectorAll('.form__input');

    // фукнция создания модального окна
    async function createModal(type, id) {
        const response = await fetch('http://localhost:3000/api/clients', {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        const clientsList = await response.json();

        const modalContainer = document.createElement('div');
        const modalContainerTitle = document.createElement('div');
        const modalTitle = document.createElement('p');
        const modalId = document.createElement('p');

        modalContainer.classList.add('modal__form-container');
        modalContainerTitle.classList.add('modal__container-title', 'flex');
        modalTitle.classList.add('text-reset', 'modal__title');
        modalId.classList.add('modal__id');

        if (type == 'change') {
            modalTitle.textContent = 'Изменить данные';
            console.log(id);
        } else {
            modalTitle.textContent = 'Новый клиент';
        }
        
        modalContainerTitle.innerHTML = contactIcon.modalCross;
        
        modalWindow.append(modalContainer);
        modalContainer.append(modalContainerTitle);
        modalContainerTitle.prepend(modalTitle, modalId);
    }
    initModalWindow();
    function initModalWindow() {

        modalButtonOpen.addEventListener('click', (e) => {
            toggleModal(true);
            createModal('change');
        });

        modalButtonClose.addEventListener('click', (e) => {
            toggleModal(false);
        });

        modalButtonCansel.addEventListener('click', (e) => {
            e.preventDefault();
            clearContacts();
            checkContactBlock();
            clearInput();
            toggleModal(false);
        });
    }

    // ивент добавления контактов
    modalButtonAddContact.addEventListener('click', function () {
        const div = document.createElement('div');
        const select = document.createElement('select');

        checkContactBlock();

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
        const svg = contactIcon.cancel;

        div.classList.add('selectblock', 'flex');
        select.classList.add('selectblock__select');
        select.setAttribute('name', 'contact');
        input.classList.add('selectblock__input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Введите данные контакта');
        button.classList.add('btn-reset', 'selectblock__clear-btn');

        modalSelectContainer.append(div);
        div.append(select, input, button);
        const optionElements = createOptionElements(options);
        select.append(...optionElements);
        button.innerHTML = svg;


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
            e.preventDefault();
            let modalSelectBlockInput = elem.parentElement.querySelector('input');
            modalSelectBlockInput.value = '';

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

    //  Функция сортировки
    let isAscending = true;
    async function sortArray(criteria) {
        const response = await fetch('http://localhost:3000/api/clients');
        const clientsList = await response.json();
        let sortArray = clientsList.sort(function (a, b) {
            let x = a[criteria]; let y = b[criteria];
            if (isAscending) {
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            } else {
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            }
        });
        clearTable();
        renderClients(sortArray);
    }
    async function sortArrayFio() {
        const response = await fetch('http://localhost:3000/api/clients');
        const clientsList = await response.json();
        let sortArray = clientsList.sort(function (a, b) {
            let x = a.surname + ' ' + a.name + ' ' + a.lastName;
            let y = b.surname + ' ' + b.name + ' ' + a.lastName;
            if (isAscending) {
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            } else {
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            }
        });
        clearTable();
        renderClients(sortArray);
    }

    // ивенты сортировки таблицы
    tableId.addEventListener('click', (e) => {
        sortArray('id');
        isAscending = !isAscending;
        rotate(tableId);
    });
    tableFio.addEventListener('click', (e) => {
        sortArrayFio();
        isAscending = !isAscending;
        rotate(tableFio);
    });
    tableDate.addEventListener('click', (e) => {
        sortArray('createdAt');
        isAscending = !isAscending;
        rotate(tableDate);
    });
    tableChange.addEventListener('click', (e) => {
        sortArray('updatedAt');
        isAscending = !isAscending;
        rotate(tableChange);
    });

    /////////////////////////////////
    // ВЗАИМОДЕЙСТВИЕ С СЕРВЕРОМ: //
    ///////////////////////////////
    const modalConactAddArray = [];

    // добавление клиента на сервер
    function addClientsItem() {
        async function createClient() {
            const response = await fetch('http://localhost:3000/api/clients', {
                method: 'POST',
                body: JSON.stringify({
                    name: capFirst(inputName.value),
                    surname: capFirst(inputSurname.value),
                    lastName: capFirst(inputMiddleName.value),
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

    // ивент добавления на сервер клиента
    const modalButtonSave = document.querySelector('#modalButtonSave');
    modalButtonSave.addEventListener('click', function (e) {
        e.preventDefault();


        const necessarilyInputs = document.querySelectorAll('.form__lable-necessarily');
        necessarilyInputs.forEach(element => {
            const input = element.querySelector('input');
            if (input.value == '') {
                toggleColor(true, element);
                return
            } else {
                toggleColor(false, element);
            }
        })

        if (!document.querySelector('.form__lable_color')) {
            toggleModal(false);
            clearArray(modalConactAddArray);
            getContacts();
            addClientsItem();
            clearInput();
            clearTable();
            renderTable();
        }
    })

    async function renderTable() {
        const response = await fetch('http://localhost:3000/api/clients', {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        const clientsList = await response.json();
        renderClients(clientsList);
    }
    renderTable();

    // функция отрисовки с сервера
    function renderClients(array) {
        array.forEach(obj => {
            const tr = document.createElement('tr');
            const id = document.createElement('td');
            const fio = document.createElement('td');
            const create = document.createElement('td');
            const change = document.createElement('td');
            const contacts = document.createElement('td');
            const contactsDiv = document.createElement('div');
            const btns = document.createElement('td');
            const createDate = document.createElement('div');
            const createTime = document.createElement('div');
            const changeDate = document.createElement('div');
            const changeTime = document.createElement('div');
            const btnEdit = document.createElement('button');
            const btnDelete = document.createElement('button');

            tr.classList.add('table__body');
            id.classList.add('table__id-width', 'table__body-common', 'color-grey');
            id.setAttribute('id', `${obj.id}`);
            fio.classList.add('table__fio-width', 'table__body-common');
            create.classList.add('table__create-width', 'table__body-common');
            change.classList.add('table__change-width', 'table__body-common');
            createDate.classList.add('table__body-date');
            createTime.classList.add('table__body-time', 'color-grey');
            changeDate.classList.add('table__body-date');
            changeTime.classList.add('table__body-time', 'color-grey');
            contacts.classList.add('table__contacts-width');
            contactsDiv.classList.add('flex', 'contacts-container');
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

            // разделяем дату и время создания итема
            normalizeTime(createDate, createTime, obj.createdAt, changeDate, changeTime, obj.updatedAt);

            // рендер иконок
            async function createSvgElements() {
                const contactsArray = obj.contacts;
                contactsArray.map(obj => {
                    switch (obj.type) {
                        case 'VK':
                            createSvg(contactIcon.vk, `vk`);
                            break;
                        case 'FaceBook':
                            createSvg(contactIcon.fb, `fb`);
                            break;
                        case `Телефон`:
                            createSvg(contactIcon.phone, `phone`);
                            break;
                        case 'Доп. телефон':
                            createSvg(contactIcon.phone, `phone2`);
                            break;
                        case 'Email':
                            createSvg(contactIcon.mail, `email`);
                            break;
                        default: createSvg(contactIcon.default, `default`);
                            break;
                    }


                    // функция добавления иконки
                    function createSvg(elem, className) {
                        const link = document.createElement('a');
                        link.classList.add(`${className}`, 'svg-common');
                        link.setAttribute('href', '#');
                        contactsDiv.append(link);
                        const svg = elem;
                        link.innerHTML = svg;
                        tippy(link, {
                            content: obj.value,
                            allowHTML: true,
                        });;
                    };

                    // сокращение количества иконок
                    const contactsContainer = document.querySelectorAll('.contacts-container');
                    contactsContainer.forEach(elem => {
                        const array = Array.from(elem.querySelectorAll('.svg-common'));
                    });
                })
            }
            createSvgElements();

            btnEdit.textContent = 'Изменить';
            btnDelete.textContent = 'Удалить'

            tableBody.append(tr);
            tr.append(id, fio, create, change, contacts, btns)
            create.append(createDate, createTime);
            change.append(changeDate, changeTime);
            contacts.append(contactsDiv);
            btns.append(btnEdit, btnDelete);

            btnEdit.addEventListener('click', function (e) {
                const tableRow = btnDelete.parentElement.parentElement;
                const elemId = tableRow.querySelector('.table__id-width').id;
                createModal('change', elemId);
            })

            btnDelete.addEventListener('click', function (e) {
                const tableRow = btnDelete.parentElement.parentElement;
                const elemId = tableRow.querySelector('.table__id-width').id;
                if (!confirm('Вы уверены, что хотите удалить?')) {
                    return;
                }
                fetch(`http://localhost:3000/api/clients/${elemId}`, {
                    method: 'DELETE',
                })
                clearTable();
                renderTable();
            })
        })
    }

    ////////////////////////////
    // всякие мелкие функции //
    //////////////////////////

    // Функция выравнивания букв
    function capFirst(str) {
        if (str) {
            return (str[0].toUpperCase() + str.slice(1).toLowerCase()).trim();
        } else return
    }

    // функция окрашивания незаполненных input
    function toggleColor(bool, elem) {
        if (bool) {
            elem.classList.add('form__lable_color');
        } else {
            elem.classList.remove('form__lable_color');
        }
    }

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

    // функция очистки таблицы
    function clearTable() {
        tableBody.innerHTML = '';
    }

    // функция очиски array
    function clearArray(array) {
        array.length = 0;
    }

    // функция очистки input'ов
    function clearInput() {
        modalFormInputs.forEach(elem => {
            elem.value = '';
        })

    }

    // функция переворота стрелочки
    function rotate(elem) {
        if (elem.classList.contains('rotated')) {
            elem.classList.remove('rotated');
        } else {
            elem.classList.add('rotated')
        }
    }

    // функция разделения даты и времени
    function normalizeTime(createdate, createtime, objcreate, changedate, changetime, objchange) {
        createdate.textContent = objcreate.slice(0, 10).split("-").reverse().join(".");
        createtime.textContent = objcreate.slice(11, 16);
        changedate.textContent = objchange.slice(0, 10).split("-").reverse().join(".");
        changetime.textContent = objchange.slice(11, 16);
    }

    // функция очистки добавленных строк контактов
    function clearContacts() {
        modalSelectContainer.innerHTML = '';
    }

    // функция проверки наличия строк контактов и нормализация отступов
    function checkContactBlock() {
        const formContacts = document.querySelector('.form-contacts');
        if (modalSelectContainer.children.length > 0) {
            formContacts.classList.add('form-contacts_padding');
        } else if (formContacts.classList.contains('form-contacts_padding')) {
            formContacts.classList.remove('form-contacts_padding');
        } else return
    }
})()