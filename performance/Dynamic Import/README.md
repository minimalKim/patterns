## 개요

- 필요에 따라 코드들을 동적으로 import한다.
  - 정적으로 가져온 모듈은 바로 렌더링할 필요가 없는 구성 요소를 포함하여 앱의 최종 번들에 모두 포함된다.
  - 이는 최종 번들의 크기를 키우므로, 초기 로드 시간을 지연시킨다.

## 구현

- React에서는 `React.Suspense`와 `React.lazy`를 사용하여 구성요소를 동적으로 로드할 수 있다.
- SSR에서 React Suspense를 지원하지 않아, `loadable-component`를 사용하였지만, 18버전부터 SSR에서도 지원하기 시작하였다.

- https://stackblitz.com/edit/node-btjbsw?file=src%2Fcomponents%2FCard4.js

## 장점

- 더 빠른 초기 로드
  - 모듈을 동적으로 가져오면 초기 번들 크기가 줄어든다.
  - 클라이언트가 다운로드 및 실행을 많이 할 필요가 없기 때문에 초기 로드가 줄어들어 대역폭이 절약된다.

## 단점

- 레이아웃 변경

  - 대체 구성 요소와 결국 렌더링되는 구성 요소의 크기가 많이 다른 경우 레이아웃 변경이 발생할 수 있습니다.

- 사용자 경험 주의
  - 초기 렌더링에 필요한 구성 요소를 지연 로드하는 경우 불필요하게 로드 시간이 길어질 수 있다.
  - 초기 렌더링에 표시되지 않는 지연 로드 구성 요소만 시도해야한다.

## IntersectionObserver로 이미지 지연로드 구현하기

```js
// ex html) <img class="lazy" data-src="https://ik.imagekit.io/demo/img/image5.jpeg?tr=w-400,h-300" />

document.addEventListener("DOMContentLoaded", () => {
  if ("IntersectionObserver" in window) {
    const lazyloadImages = document.querySelectorAll(".lazy");
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          var image = entry.target;
          // data-src를 src로 치환시켜 이미지를 로드되게 한다.
          image.src = image.dataset.src;
          image.classList.remove("lazy");
          imageObserver.unobserve(image);
        }
      });
    });

    lazyloadImages.forEach((image) => {
      // imageObserver가 lazyloadImages El들을 주시하도록 등록
      imageObserver.observe(image);
    });

    // IntersectionObserve를 지원하지 않는 경우, scrollTop으로 계산한다.
  } else {
    let lazyloadThrottleTimeout;
    const lazyloadImages = document.querySelectorAll(".lazy");

    function lazyload() {
      if (lazyloadThrottleTimeout) {
        clearTimeout(lazyloadThrottleTimeout);
      }

      lazyloadThrottleTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset;
        lazyloadImages.forEach(function (img) {
          if (img.offsetTop < window.innerHeight + scrollTop) {
            img.src = img.dataset.src;
            img.classList.remove("lazy");
          }
        });
        if (lazyloadImages.length == 0) {
          document.removeEventListener("scroll", lazyload);
          window.removeEventListener("resize", lazyload);
          window.removeEventListener("orientationChange", lazyload);
        }
      }, 20);
    }

    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
  }
});
```
