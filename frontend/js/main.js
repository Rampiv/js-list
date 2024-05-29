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
    const modalTitle = document.querySelector('.modal__title');
    const modalId = document.querySelector('.modal__id');
    const inputSurname = document.querySelector('#inputsurname');
    const inputName = document.querySelector('#inputname');
    const inputMiddleName = document.querySelector('#inputmiddlename');
    const tableBody = document.querySelector('#tableBody')
    const tableId = document.querySelector('#tableId');
    const tableFio = document.querySelector('#tableFio');
    const tableDate = document.querySelector('#tableDate');
    const tableChange = document.querySelector('#tableChange');
    const modalFormInputs = document.querySelectorAll('.form__input');

    // preloader
    window.addEventListener('load', function () {
        let preloader = document.getElementById('preloader');
        preloader.style.display = 'none';
    });


    ////////////////////////////////////
    // Блок работы с модальным окном //
    //////////////////////////////////
    const modalFormItem = document.querySelector('.form__item');
    const modalFormContacts = document.querySelector('.form-contacts');
    const modaTitleContainer = document.querySelector('.modal__container-title');
    const modalFormContainer = document.querySelector('.modal__form-container');

    // фукнция изменения модального окна при нажатии на кнопку "изменить"
    async function changeModalTitle(id) {
        const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        const clientsList = await response.json();
        modalId.classList.remove('hide');
        modalId.textContent = `ID: ${id}`;
        modalTitle.textContent = 'Изменить данные';
        modalButtonCansel.textContent = 'Удалить клиента';
        inputSurname.value = clientsList.surname;
        inputName.value = clientsList.name;
        if (clientsList.lastName) {
            inputMiddleName.value = clientsList.lastName;
        }

        if (clientsList.contacts) {
            clearContacts();
            clientsList.contacts.forEach(item => {
                addContact(item.type, item.value);
            });
            let modalSelectBlockInputArray = modalSelectContainer.querySelectorAll(".selectblock__input");
            modalSelectBlockInputArray.forEach(elem => {
                elem.style.color = '#333';
                let modalSelectBlockButtonClear = elem.nextSibling;
                toggleVisible(modalSelectBlockButtonClear, true);
            }
            );
        }
    }

    // функция изменения модального окна для подтверждения удаления
    function changeDeleteModal() {
        modalTitle.textContent = 'Удалить клинета';
        modalId.textContent = '';
        modalId.classList.add('hide');
        modalFormItem.style.display = 'none';
        modalFormContacts.style.display = 'none';
        modaTitleContainer.classList.add('modal__container-title_flex');
        modalFormContainer.classList.add('modal__form-container_flex');
        if (document.querySelector('.modaldell-text')) {
            return
        } else {
            const p = document.createElement('p');
            p.classList.add('text-reset', 'modaldell-text');
            p.textContent = 'Вы действительно хотите удалить данного клиента?';
            modaTitleContainer.after(p);
        }

        modalButtonCansel.textContent = 'Отмена';
        modalButtonSave.textContent = 'Удалить';
    }

    // функция отката изменений модального окна
    function rollingBackModal() {
        modalFormItem.style.display = 'flex';
        modalFormContacts.style.display = 'flex';
        modaTitleContainer.classList.remove('modal__container-title_flex');
        modalFormContainer.classList.remove('modal__form-container_flex');
        modalButtonCansel.textContent = 'Отмена';
        modalButtonSave.textContent = 'Сохранить';
        const p = document.querySelector('.modaldell-text');
        if (p) {
            p.remove();
        }

    }

    initModalWindow();
    // кнопки модального окна
    function initModalWindow() {

        modalButtonOpen.addEventListener('click', (e) => {
            toggleModal(true);
            clearInput();
            clearContacts();
            checkContactBlock();
            modalTitle.textContent = 'Новый клиент';
            modalId.textContent = '';
            modalButtonCansel.textContent = 'Отмена';
        });

        modalButtonClose.addEventListener('click', (e) => {
            toggleModal(false);
            setTimeout(() => { rollingBackModal() }, 250);
        });

        modalButtonCansel.addEventListener('click', (e) => {
            e.preventDefault();
            if (modalButtonCansel.textContent === 'Отмена') {
                clearContacts();
                checkContactBlock();
                clearInput();
                toggleModal(false);
                setTimeout(() => { rollingBackModal() }, 250);
            } else if (modalButtonCansel.textContent === 'Удалить клиента') {
                changeDeleteModal();
            }
        });
    }

    // ивент сохранения на сервер клиента ИЛИ изменения клиента ИЛИ удаления клиента
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

        if (!document.querySelector('.form__lable_color') && modalTitle.textContent === 'Новый клиент') {
            toggleModal(false);
            clearArray(modalConactAddArray);
            getContacts();
            addClientsItem();
            clearInput();
            clearTable();
            renderTable();
        } else if (!document.querySelector('.form__lable_color') && modalTitle.textContent === 'Изменить данные') {
            toggleModal(false);
            clearArray(modalConactAddArray);
            getContacts();
            changeClient(modalId.textContent.slice(4));
            clearInput();
            clearTable();
            renderTable();
        } else if (modalButtonSave.textContent === 'Удалить') {
            toggleModal(false);
            deleteClient(modalId.textContent);
            clearTable();
            renderTable();
        }
        checkContactBlock();
        rollingBackModal();
    })

    // ивент добавления контактов
    modalButtonAddContact.addEventListener('click', () => { addContact() })

    // функция добавления контакта + событие очистки контакта
    function addContact(type, value) {
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
            checkCorrectInput(elem.previousSibling, elem);

        })
        );
        // событие очистить input в добавлении контакта
        let modalSelectBlockButtonClearArray = modalSelectContainer.querySelectorAll(".selectblock__clear-btn");
        modalSelectBlockButtonClearArray.forEach(elem => elem.addEventListener('click', function (e) {
            e.preventDefault();
            let modalSelectBlockInput = elem.parentElement.querySelector('input');
            modalSelectBlockInput.value = '';
            clearArray(modalConactAddArray);
            getContacts();
            inCorrectText(false);
        }));

        // при подгрузке с сервера, выбор option
        const option = select.getElementsByTagName('option');
        for (let i = 0; i < option.length; i++) {
            if (option[i].label === type) {
                option[i].selected = true;
                input.value = value;
            }
        }
        checkContactBlock();
    }

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

    // функция проверки правильности введенных контактов
    function checkCorrectInput(select, input) {
        // console.log(select.options[select.selectedIndex].text, input.value);
        switch (select.options[select.selectedIndex].text) {
            case 'Телефон':
                input.setAttribute('type', 'number');
                break;
            case 'Доп.телефон':
                input.setAttribute('type', 'number');
                break;
            case 'Email':
                const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
                function isEmailValid(value) {
                    return EMAIL_REGEXP.test(value);
                }
                function onInput() {
                    if (isEmailValid(input.value)) {
                        inCorrectText(false);
                    } else {
                        inCorrectText(true);
                    }
                }
                onInput()
                break;
            case 'VK':
                break;
            case 'FaceBook':
                break;
        }
    }

    // функция добавления надписи ошибки
    function inCorrectText(value) {
        if (value && document.querySelectorAll('.incorrect-text').length == 0) {
            const p = document.createElement('p');
            p.classList.add('text-reset', 'incorrect-text');
            p.textContent = 'Ошибка: новая модель организационной деятельности предполагает независимые способы реализации поставленных обществом задач!'
            modalFormContacts.classList.add('form__contacts-margin');
            document.querySelector('.group-bottombtns').before(p);
        } else if (!value && document.querySelectorAll('.incorrect-text').length == 1) {
            document.querySelector('.incorrect-text').remove();
            modalFormContacts.classList.remove('form__contacts-margin');
        }
    }

    // функция очистки добавленных строк контактов в модальном окне
    function clearContacts() {
        modalSelectContainer.innerHTML = '';
    }

    /////////////////////////////
    // Блок работы с таблицей //
    ///////////////////////////

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

    // функция переворота стрелочки
    function rotate(elem) {
        const children = elem.querySelector('.table__fio-sign');
        if (elem.classList.contains('rotated')) {
            elem.classList.remove('rotated');
        } else {
            elem.classList.add('rotated')
        }
        if (children && children.classList.contains('rotated')) {
            children.classList.remove('rotated')
        } else if (children) {
            children.classList.add('rotated')
        }
    }

    // функция разделения даты и времени
    function normalizeTime(createdate, createtime, objcreate, changedate, changetime, objchange) {
        createdate.textContent = objcreate.slice(0, 10).split("-").reverse().join(".");
        createtime.textContent = objcreate.slice(11, 16);
        changedate.textContent = objchange.slice(0, 10).split("-").reverse().join(".");
        changetime.textContent = objchange.slice(11, 16);
    }

    // функция добавления контактов в array
    function getContacts() {
        const selectBlockArray = Array.from(document.querySelectorAll('.selectblock'));
        return selectBlockArray.map(elem => {
            const select = elem.querySelector('.selectblock__select');
            const type = select.options[select.selectedIndex].text;
            const value = elem.querySelector('.selectblock__input').value.trim();
            if (value) {
                const selectObject = { type, value };
                modalConactAddArray.push(selectObject);
            }
        }
        );
    }

    /////////////////////////////////
    // ВЗАИМОДЕЙСТВИЕ С СЕРВЕРОМ //
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
                    contacts: Array.from(modalConactAddArray).slice(0, 6),
                }),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                }
            });
        }
        createClient();

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

    // функция отрисовки с сервера (+ кнопки изменить/удалить)
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

            // функция рендера иконок       
            function createSvgElements(contactsArray) {
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
                })
            }

            // сокращение количества иконок в контактах
            function reduceContacts(arrayContacts) {
                return arrayContacts.slice(0, 4);
            }

            // функция добавления новой икноки в контакты с цифрой скрытых контактов
            function addIconMoreContacts(array) {
                const linkSpecial = document.createElement('a');
                const p = document.createElement('p');
                p.classList.add('text-reset', 'specialContactsIcon');
                linkSpecial.classList.add('svg-common', 'specialSvg');
                linkSpecial.setAttribute('href', '#');
                contactsDiv.append(linkSpecial);
                const svgSpecial = contactIcon.ellipse;
                linkSpecial.innerHTML = svgSpecial;
                linkSpecial.append(p);
                tippy(linkSpecial, {
                    content: 'Посмотреть все',
                    allowHTML: true,
                });;
                p.innerHTML = '+' + (array.length - 4);
                addEventSpecialSvg(linkSpecial);
            }

            const contactsArray = reduceContacts(obj.contacts);


            console.log(contactsArray);
            createSvgElements(contactsArray);

            if (contactsArray.length >= 4) {
                addIconMoreContacts(obj.contacts);
            }

            // ивент раскрытия списка иконок
            async function addEventSpecialSvg(link) {
                link.addEventListener('click', (e) => {
                    link.parentElement.classList.add('flex-wrap')
                    contactsDiv.innerHTML = '';
                    createSvgElements(obj.contacts);
                })
            }


            btnEdit.textContent = 'Изменить';
            btnDelete.textContent = 'Удалить'

            tableBody.append(tr);
            tr.append(id, fio, create, change, contacts, btns)
            create.append(createDate, createTime);
            change.append(changeDate, changeTime);
            contacts.append(contactsDiv);
            btns.append(btnEdit, btnDelete);

            btnEdit.addEventListener('click', function (e) {
                toggleModal(true);
                checkContactBlock();
                const tableRow = btnDelete.parentElement.parentElement;
                const elemId = tableRow.querySelector('.table__id-width').id;
                changeModalTitle(elemId);
            })

            btnDelete.addEventListener('click', function (e) {
                const tableRow = btnDelete.parentElement.parentElement;
                const elemId = tableRow.querySelector('.table__id-width').id;
                toggleModal(true);
                changeDeleteModal();
                addModalId(elemId);
            })
        })
    }

    // функция изменения данных на сервере
    async function changeClient(id) {
        const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                name: capFirst(inputName.value),
                surname: capFirst(inputSurname.value),
                lastName: capFirst(inputMiddleName.value),
                contacts: Array.from(modalConactAddArray).slice(0, 6),
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            }
        });
    }

    // функция удаления клиента
    async function deleteClient(id) {
        fetch(`http://localhost:3000/api/clients/${id}`, {
            method: 'DELETE',
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

    // функция проверки наличия строк контактов и нормализация отступов
    function checkContactBlock() {
        const formContacts = document.querySelector('.form-contacts');
        if (modalSelectContainer.children.length > 0) {
            formContacts.classList.add('form-contacts_padding');
        } else if (formContacts.classList.contains('form-contacts_padding')) {
            formContacts.classList.remove('form-contacts_padding');
        } else return
    }

    // функция добавления id в модальном окне
    function addModalId(id) {
        modalId.textContent = id;
    }


})()