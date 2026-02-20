document.addEventListener('DOMContentLoaded', function () {
    let addCount = 2;
    document.getElementById('addOfficer').addEventListener('click', function (event) {
        event.preventDefault();


        const officerContainer = document.getElementById('officerContainer');
        const newOfficerWrapper = document.createElement('div');

        newOfficerWrapper.classList.add('clubofficer-content1');
        newOfficerWrapper.id = 'officerContainer';

        const newOfficerImage = document.createElement('div');
        newOfficerImage.classList.add('officersimage1');
        const newPicLabel = document.createElement('label');
        const newPicInput = document.createElement('input');

        newPicInput.type = 'file';
        newPicInput.name = 'off_image' + (addCount)
        newPicInput.id = 'off_image' + (addCount);
        newPicLabel.htmlFor = newPicInput.id;
        newPicLabel.textContent = 'Insert Officer Image';

        newOfficerWrapper.appendChild(newOfficerImage);
        newOfficerImage.appendChild(newPicLabel);
        newOfficerImage.appendChild(newPicInput);

        document.getElementById('officerContent').appendChild(newOfficerWrapper);


        const newOfficerInfo = document.createElement('p');
        newOfficerInfo.classList.add('otitle1');

        const newOfficerFirstNameLabel = document.createElement('label');
        const newOfficerFirstNameInput = document.createElement('input');

        newOfficerFirstNameInput.type = 'text';
        newOfficerFirstNameInput.name = 'off_first_name' + (addCount);
        newOfficerFirstNameInput.id = 'off_first_name' + (addCount);
        newOfficerFirstNameInput.placeholder = 'Officer First Name';
        newOfficerFirstNameInput.required = true;

        newOfficerFirstNameLabel.htmlFor = newOfficerFirstNameInput.id;

        newOfficerWrapper.appendChild(newOfficerInfo);
        newOfficerInfo.appendChild(newOfficerFirstNameLabel);
        newOfficerInfo.appendChild(newOfficerFirstNameInput);


        const newOfficerLastNameLabel = document.createElement('label');
        const newOfficerLastNameInput = document.createElement('input');

        newOfficerLastNameInput.type = 'text';
        newOfficerLastNameInput.name = 'off_last_name' + (addCount);
        newOfficerLastNameInput.id = 'off_last_name' + (addCount);
        newOfficerLastNameInput.placeholder = 'Officer Last Name';
        newOfficerLastNameInput.required = true;

        newOfficerLastNameLabel.htmlFor = newOfficerLastNameInput.id;


        newOfficerInfo.appendChild(newOfficerLastNameLabel);
        newOfficerInfo.appendChild(newOfficerLastNameInput);


        const newOfficerPositionLabel = document.createElement('label');
        const newOfficerPositionSelect = document.createElement('select');
        const positionOption1 = document.createElement('option');
        const positionOption2 = document.createElement('option');
        const positionOption3 = document.createElement('option');
        const positionOption4 = document.createElement('option');
        const positionOption5 = document.createElement('option');
        const positionOption6 = document.createElement('option');

        newOfficerPositionSelect.name = 'officer_position' + (addCount);
        newOfficerPositionSelect.id = 'officer_position' + (addCount);
        newOfficerPositionSelect.required = true;

        newOfficerPositionLabel.htmlFor = newOfficerPositionSelect.id;

        positionOption1.value = null;
        positionOption1.text = '';
        positionOption2.value = 'president';
        positionOption2.text = 'President';
        positionOption3.value = 'vice_president';
        positionOption3.text = 'Vice President';
        positionOption4.value = 'secretary';
        positionOption4.text = 'Secretary';
        positionOption5.value = 'treasurer';
        positionOption5.text = 'Treasurer';
        positionOption6.value = 'historian';
        positionOption6.text = 'Historian';

        newOfficerPositionSelect.appendChild(positionOption1);
        newOfficerPositionSelect.appendChild(positionOption2);
        newOfficerPositionSelect.appendChild(positionOption3);
        newOfficerPositionSelect.appendChild(positionOption4);
        newOfficerPositionSelect.appendChild(positionOption5);
        newOfficerPositionSelect.appendChild(positionOption6);


        newOfficerInfo.appendChild(newOfficerPositionLabel);
        newOfficerInfo.appendChild(newOfficerPositionSelect);


        newOfficerWrapper.appendChild(newOfficerInfo);


        addCount++;
        const newButton = document.createElement('button');
        newButton.textContent = 'Remove';
        newButton.classList.add('removeButton');

        newButton.addEventListener('click', function (event) {
            event.preventDefault();
            event.target.parentNode.remove();
            addCount--;
        });

        newOfficerWrapper.appendChild(newButton);


    });
})