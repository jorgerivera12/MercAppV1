import Swal from 'sweetalert2'

export function useCartAlert() {
  function showAddedToCart(productName) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: '¡Añadido al carrito!',
      text: productName,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      iconColor: '#e8282e',
      customClass: {
        popup: 'swal-cart-popup'
      }
    })
  }

  return { showAddedToCart }
}
