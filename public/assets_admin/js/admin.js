///////////////////block or unblock///////////

  const unBlock = async(customerid)=>{
    event.preventDefault();
   
    try{
  
      const result = await Swal.fire({
        title: 'UnBlock User',
        text: 'Do you want to unblock an User?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33", 
        confirmButtonText: 'Yes',
        cancelButtonText: 'DISMISS'
        
    });
  
    if(result.value){
  
      const response = await fetch(`/blockUser?customerid=${customerid}`,{
        method: 'POST'
      })
  
      const data = await response.json()
  
      if(data.message = "success"){
        Swal.fire({
          icon: "success",
          title: "User has been unblocked successfully",
          showConfirmButton: true,
          // confirmButtonText: "OK",
          // confirmButtonColor: "#4CAF50",
      });
      // document.getElementById('couponRow' + couponId).innerHTML = ''
      if(result.value){
        
        window.location.href = '/customers'
    }
      }else{
  
        Swal.fire({
          icon: "error",
          title: "Somthing error!!",
          showConfirmButton: true,
          confirmButtonText: "DISMISS",
          confirmButtonColor: "#D22B2B"
          
      });
  
      }
  
    }
  
    }catch(error){
      console.log(error.message);
    }
  }


  const blockUser = async(customerid)=>{
    event.preventDefault();
   
    try{
  
      const result = await Swal.fire({
        title: 'Block User',
        text: 'Do you want to block an User?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33", 
        confirmButtonText: 'Yes',
        cancelButtonText: 'DISMISS'
        
    });
  
    if(result.value){
  
      const response = await fetch(`/blockUser?customerid=${customerid}`,{
        method: 'POST'
      })
  
      const data = await response.json()
  
      if(data.message = "success"){
        Swal.fire({
          icon: "success",
          title: "User has been blocked successfully",
          showConfirmButton: true,
          
      });
      // document.getElementById('couponRow' + couponId).innerHTML = ''
      if(result.value){
        
        window.location.href = '/customers'
    }
      }else{
  
        Swal.fire({
          icon: "error",
          title: "Somthing error!!",
          showConfirmButton: true,
          confirmButtonText: "DISMISS",
          confirmButtonColor: "#D22B2B"
          
      });
  
      }
  
    }
  
    }catch(error){
      console.log(error.message);
    }
  }
 
  /////////////// ORDER UPDATE ////////////////////
  const orderUpdateSelects = document.querySelectorAll('[name="orderUpdate"]')

  if(orderUpdateSelects){
    orderUpdateSelects.forEach((orderUpdateSelect) => {
    orderUpdateSelect.addEventListener('change', async ()=>{
      console.log("helloo");
      const selectedOption = orderUpdateSelect.value
      const orderId = orderUpdateSelect.id.split('-')[1]

      try {
         console.log("orderupdate script")
        const result = await Swal.fire({
          title: `Confirm Change Order Status to "${selectedOption}"?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33", 
          confirmButtonText: 'Yes, Change',
          cancelButtonText: 'DISMISS'
          
      });

      if(result.value){
        const response = await fetch(`/updateOrder?orderId=${orderId}`,{
          method: 'POST',
          headers:{
            'Content-Type' : "application/json"
          },
          body: JSON.stringify({
            status: selectedOption
          })
        })
      
        const data = await response.json()
  
        if(data.message = "Success"){
          const result = await Swal.fire({
            icon: "success",
            title: "Order staus has been changed successfully!!",
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#4CAF50",
        });
      }
      
      if(result.value){
        location.reload()
      } 
      
      }

        
      } catch (error) {
        console.log(error.message);
      }
    })
  })
  }
 


  // const orderUpdateSelects = document.querySelectorAll('[name="orderUpdate"]')

  // if(orderUpdateSelects){
  //   orderUpdateSelects.forEach((orderUpdateSelect) => {
  //   orderUpdateSelect.addEventListener('change', async ()=>{
  //     console.log("helloo");
  //     const selectedOption = orderUpdateSelect.value
  //     const orderId = orderUpdateSelect.id.split('-')[1]

  //     try {
  //        console.log("orderupdate script")
  //       const result = await Swal.fire({
  //         title: `Confirm Change Order Status to "${selectedOption}"?`,
  //         icon: 'question',
          
  //         showCancelButton: true,
  //         confirmButtonColor: "#3085d6",
  //         cancelButtonColor: "#d33", 
  //         confirmButtonText: 'Yes, Change',
  //         cancelButtonText: 'DISMISS'
          
  //     });

   
    

  //     if(result.value){
  //       const response = await fetch(`/updateOrder?orderId=${orderId}`,{
  //         method: 'POST',
  //         headers:{
  //           'Content-Type' : "application/json"
  //         },
  //         body: JSON.stringify({
  //           status: selectedOption
  //         })
  //       })
      
  //       const data = await response.json()
  
  //       if(data.message = "Success"){
  //         const result = await Swal.fire({
  //           icon: "success",
  //           title: "Order staus has been changed successfully!!",
  //           showConfirmButton: true,
  //           confirmButtonText: "OK",
  //           confirmButtonColor: "#4CAF50",
  //       });
  //     }
      
  //     if(result.value){
  //       location.reload()
  //     } 
      
  //     }

        
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   })
  // })
  // }