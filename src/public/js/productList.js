
function showDetails(productId) {

    window.location.href = '/products/' + productId;
}

function bePremium(userId){

    window.location.href = `/api/users/premium/${userId}`;

}
