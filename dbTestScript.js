document.getElementById('uploadForm').addEventListener('submit', uploadImage);

function uploadImage(event) {
    event.preventDefault();

    var fileInput = document.getElementById('imageInput');
    var file = fileInput.files[0];

    var formData = new FormData();
    formData.append('imageFile', file);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'upload.php', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById('message').textContent = xhr.responseText;
        } else {
            document.getElementById('message').textContent = 'Error uploading image.';
        }
    };
    xhr.send(formData);
}


function displayImage(imagePath) {
    var imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = '';

    if (imagePath === 'stored') {
        var img = document.createElement('img');
        img.src = 'display.php';
        imageContainer.appendChild(img);
    } else {
        var p = document.createElement('p');
        p.textContent = 'Image upload failed.';
        imageContainer.appendChild(p);
    }
}
