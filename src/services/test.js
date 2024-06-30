// document.querySelector('.rn-bb03').click();
// jsf_pdi_GoPerfSale();

var seat = 108;
var delay = 150; // 딜레이 시간

var fns = function (seatNum) {
  try {
    var iframe = document.querySelector('[name="ifrmSeatFrame"]');
    var iDocument = iframe.contentDocument;
    var iWindow = iframe.contentWindow;

    iWindow.ChangeBlock(`${seatNum}`);
    console.log('구역 변경: ', seatNum);

    setTimeout(() => {
      var id = iDocument
        .getElementById('divSeatArray')
        .querySelectorAll('[grade]')[0];

      if (id) {
        id.click();
        iWindow.ChoiceEnd();
      }
    }, delay);
  } catch (e) {
    console.log('에러', e);
  }
};

var emp = function () {
  try {
    var iframe = document.querySelector('[name="ifrmSeatFrame"]');
    var iWindow = iframe.contentWindow;

    var emptyIdx = iWindow.ArBlockRemain.filter((c) => !!c).findIndex(
      (c) => c !== '0',
    );
    console.log('빈 자리 있는 구역: ', emptyIdx);
    if (emptyIdx > -1) {
      fns(emptyIdx + 1);
    }
  } catch (e) {
    console.log('에러', e);
  }
};

fdc_CalDateClick('2024-08-04');

setTimeout(() => {
  fdc_ChoiceSeat();
  setTimeout(() => {
    fns(seat);
  }, delay);
}, delay);
