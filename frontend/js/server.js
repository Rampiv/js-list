(function () {
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
                    lastname: capFirst(inputMiddleName.value).trim(),
                    contacts: modalConactAddArray,
                }),
                headers: {
                    'Content-Type': 'application/json',
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
            const label = elem.querySelector('.selectblock__input').value.trim();
            const selectObject = { type, label };
            modalConactAddArray.push(selectObject);
        }
        );
    }

    // функция очиски array
    function clearArray(array) {
        array.length = 0;
    }


    const modalButtonSave = document.querySelector('#modalButtonSave');

    modalButtonSave.addEventListener('click', function (e) {
        e.preventDefault();
        console.log(inputSurname.value);
        console.log(inputName.value);
        console.log(inputMiddleName.value);

        clearArray(modalConactAddArray);
        getContacts();
        // getClientsItem();


    })

    // Функция выравнивания букв
    function capFirst(str) {
        return str[0].toUpperCase() + str.slice(1).toLowerCase();

    }
})();