# TheLocals e-mail letters

## Версия NodeJS

```
>= 6
```

## Установка

```
yarn install
```

## Запуск локального сервера

```
gulp
```
http://localhost:9000/ откроется автоматически после запуска сервера

## Сборка

```
gulp build
```

## Деплой на gh-pages

```
gulp deploy
```

## Классы

* Начинаются с нижнего подчёркивания "_" (inline.css).

  Стили определённого класса переносятся в аттрибут style html-тега с текущим классом, а сам класс у тега удаляется. Например:

  ```css
  ._EmailLink--no-underline {
    text-decoration: none;
  }
  ```

  ```html
  <a class="_EmailLink--no-underline" href="#" style="display: inline-block;">Ссылка</a>
  ```

  На выходе:

  ```html
  <a href="#" style="display: inline-block; text-decoration: none;">Ссылка</a>
  ```

* Без нижнего подчёркивания (embedded.css).

  Стили переносятся в тег `<style>`, который вставляется в `<head>`, при этом сам класс с html-тега не удаляется. Например:

  ```css
  .EmailLink {
    color: red !important;
  }
  ```

  ```html
  <a class="EmailLink" href="#">Ссылка</a>
  ```

  На выходе:

  ```html
  <style>
    .EmailLink {
      color: red !important;
    }
  }

  ...

  <a class="EmailLink" href="#">Ссылка</a>
  ```