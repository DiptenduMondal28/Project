window.addEventListener('DOMContentLoaded',async()=>{
    const objUrlParams= new URLSearchParams(window.location.search);
    const page=objUrlParams.get('page') || 1;
    console.log('objUrlParams',objUrlParams);
    console.log('page',page)
    const token = localStorage.getItem('token')
    // const itemNo=document.getElementById('datashowno').value;
    // const itemNoNumeric=Number(itemNo)
    // localStorage.setItem('itemNo',itemNoNumeric)
    let finalItemNo=localStorage.getItem('itemNo')
    let detail =await axios.get(`http://localhost:3000/getexpence?page=${page}`,{headers:{'Authorization':token},params:{ITEMS_PER_PAGE:finalItemNo}}).then(({data:{expence,...PageData}})=>{
        console.log(expence);
        for(let i=0;i<expence.length;i++){
            showDelete(expence[i]);
        }
        showpagination(PageData);
    }).catch(err=>{
        console.log(err);
    })
    

})

const pagination=document.getElementById('pagination')

async function showpagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage}){
    
    pagination.innerHTML='';
    console.log(previousPage,currentPage,nextPage)
    if(hasPreviousPage){
        const btn2=document.createElement('button');
        btn2.innerHTML=previousPage;
        btn2.addEventListener('click',()=>getExpence(previousPage));
        pagination.appendChild(btn2);
    }

    const btn1=document.createElement('button');
    btn1.innerHTML=`<h3>${currentPage}</h3>`;
    btn1.addEventListener('click',()=>getExpence(currentPage));
    pagination.appendChild(btn1);

    if(hasNextPage && nextPage<=lastPage){
        const btn3=document.createElement('button');
        btn3.innerHTML=nextPage;
        btn3.addEventListener('click',()=>getExpence(nextPage));
        pagination.appendChild(btn3);
    }

}

async function getExpence(page){
    console.log(page)
    const token = localStorage.getItem('token')
    const finalItemNo=localStorage.getItem('itemNo');
    console.log(localStorage.getItem('itemNo'))
    await axios.get(`http://localhost:3000/getexpence?page=${page}`,{headers:{'Authorization':token},params:{ITEMS_PER_PAGE:finalItemNo}}).then(({data:{expence,...PageData}})=>{
        console.log(expence);
        for(let i=0;i<expence.length;i++){
            showDelete(expence[i]);
        }
        showpagination(PageData);
    }).catch(err=>{
        console.log(err);
    })
}


async function showDelete(detail){

    let expenceList=document.getElementById('expencelist');

    let expence=document.createElement('li');
    expence.textContent=`name: ${detail.name} expence: ${detail.exp} item: ${detail.item} under ${detail.category}`;

    let deleteKey=document.createElement('input');
    deleteKey.type='button';
    deleteKey.value='delete';
    deleteKey.id="deletekey";
    deleteKey.onclick=()=>{
        const token = localStorage.getItem('token')
        let element = axios.delete(`http://localhost:3000/deletadata/${detail.id}`,{headers:{'Authorization':token}});
        axios.delete(element)
        expenceList.removeChild(expence);
        
    }
    expence.appendChild(deleteKey);
    expenceList.appendChild(expence);
}

async function myfunc(event){
    //event.preventDefault();
    let detail={
        name:document.getElementById('name').value,
        exp:document.getElementById('expence').value,
        item:document.getElementById('item').value,
        category:document.getElementById('category').value
    }
    const token = localStorage.getItem('token')
    await axios.post('http://localhost:3000/datapost',detail,{headers:{'Authorization':token}})
    
    document.getElementById('name').value=null;
    document.getElementById('expence').value=null;
    document.getElementById('item').value=null;
    document.getElementById('category').value=null;
}

window.addEventListener('DOMContentLoaded',()=>{
    const token=localStorage.getItem('token')
    let ispremium=axios.get('http://localhost:3000/ispremium',{headers:{'Authorization':token}}).then(result=>{
        console.log(result)
        if(result.data[0].ispremium===true){
            document.getElementById('rzp-button1').style.display='none';
            document.getElementById('ispremium').textContent='you are a premium user SEE LEADERBOARD:';
            premiumfeature(result);
        }
    })
    
})

document.getElementById('rzp-button1').onclick= async function (e){
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await axios.get('http://localhost:3000/purchase/premiummembership',{headers:{'Authorization':token}})
    console.log(response);
    var options={
        "key":response.data.key_id,
        "order_id": response.data.order.id,
        "handler":async function (response){
            await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id,
            },{headers:{'Authorization':token}})

            alert('you are now a premium user')

        }
    };
    const rzp1=new Razorpay(options);
    rzp1.open();
    e.preventDefault();
    rzp1.on('payment.failed',function(response){
        console.log(response);
        alert('something wrong')
    });
};

async function premiumfeature(result){

    const premium=document.getElementById('ispremium');
    const leaderboardButton=document.createElement('input');
    leaderboardButton.type='button';
    leaderboardButton.value='leadderboard';
    leaderboardButton.onclick=async()=>{
        const token=localStorage.getItem('token');
        const userleaderboardArray=await axios.get('http://localhost:3000/premium/leaderboard',{headers:{'Authorization':token}})
        console.log(userleaderboardArray);

        const leadderboardElement=document.getElementById('leaderboard')
        const leadderboardli=document.createElement('li')
        leadderboardElement.innerHTML+="<h2>leader board</h2>"
        userleaderboardArray.data.forEach(element => {
            leadderboardElement.innerHTML +=`<li>name:${element.name} expence:${element.totalexpence}</li>`
        });
    }
    premium.appendChild(leaderboardButton);

    const downloadExpece=document.createElement('input');
    downloadExpece.type='button';
    downloadExpece.value='download list';
    downloadExpece.onclick=async()=>{
        const token=localStorage.getItem('token');
        const file=await axios.get('http://localhost:3000/premium/downloadexpence',{headers:{'Authorization':token}}).then(response=>{
            if(response.status===200){
                var a = document.createElement('a');
                a.href=response.data.fileUrl;
                a.download='myexpense.csv';
                a.click();
            }else{
                throw new Error(response.data.message);
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    premium.appendChild(downloadExpece);
}

const item=document.getElementById('itemButton')
item.addEventListener('click',()=>{
    const itemNo=document.getElementById('datashowno').value;
    const itemNoNumeric=Number(itemNo)
    localStorage.setItem('itemNo',itemNoNumeric)
})