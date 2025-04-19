import React from 'react'

const Footer = () => {
  return (
    <div className='d-flex justify-content-center align-items-center' style={{backgroundColor: '#19355A', height: '100px', color: 'white'}} dir='rtl'>
          <span className='text-center d-block '> جميع الحقوق محفوظة. تم التطوير لصالح جامعة حلوان بواسطة طلاب كلية  حاسبات و ذكاء اصطناعي تحت اشراف مركز الحساب العلمي . &copy; 2025</span>
            {/* TODO: Remove this section After Ask The TeamLeader */}
          {/* <span className='text-center d-block mt-3'>للتواصل و الاستعلام يرجي الاتصال بالرقم التالي 01283220056 - 01022119213</span> */}
    </div>
  )
}

export default Footer
