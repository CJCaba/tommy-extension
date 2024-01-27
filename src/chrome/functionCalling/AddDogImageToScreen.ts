export function addDogImageToScreen(size = '100px', position = 'top-left') {
    const imageUrl = 'https://media.tenor.com/fej4_qoxdHYAAAAM/cute-puppy.gif';

    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;
    imageElement.style.width = size;
    imageElement.style.height = 'auto';
    imageElement.style.position = 'fixed';
    imageElement.style.top = '0';
    imageElement.style.left = '0';
    imageElement.style.zIndex = '1000';

    document.body.insertBefore(imageElement, document.body.firstChild);
}