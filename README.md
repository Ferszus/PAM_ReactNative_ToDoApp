# ToDoApp

<img src="/assets/adaptive-icon.png" width="250px" style="border-radius: 30px;">

ToDoApp to aplikacja do zarządzania zadaniami stworzona za pomocą React Native i Expo. Aplikacja pozwala użytkownikom dodawać, edytować, usuwać zadania oraz ustalać terminy. Zawiera również tryb ciemny oraz funkcję sortowania zadań według daty terminu.

## Funkcje

-   **Dodawanie zadań**: Użytkownicy mogą dodawać zadania z lub bez terminów.
-   **Edycja zadań**: Użytkownicy mogą modyfikować istniejące zadania.
-   **Usuwanie zadań**: Użytkownicy mogą usuwać zadania.
-   **Zakończenie zadania**: Możliwość oznaczenia zadania jako ukończone.
-   **Sortowanie po terminie**: Zadania mogą być sortowane według daty terminu.
-   **Tryb ciemny**: Przełączanie między trybem jasnym a ciemnym.
-   **Sekcja "O nas"**: Wyświetla informacje o zespole deweloperskim.

## Zrzuty ekranu

![Zrzut ekranu ToDoApp](/assets/gui.png)

## Jak zacząć

### Wymagania wstępne

-   **Node.js**: Upewnij się, że masz zainstalowany Node.js.
-   **Expo CLI**: Aby uruchomić projekt lokalnie i budować pliki APK.
-   **Android Studio**: Do emulowania urządzeń Android do testowania.
-   **Visual Studio Code**: Edytor kodu do rozwoju aplikacji.

### Instalacja

1. **Sklonuj repozytorium**:

    ```bash
    git clone https://github.com/Ferszus/PAM_ReactNative_ToDoApp.git
    cd PAM_ReactNative_ToDoApp
    ```

2. **Zainstaluj zależności**:

    ```bash
    npm install
    ```

3. **Uruchom aplikację**:
   Uruchom aplikację w swoim lokalnym środowisku, używając poniższej komendy:

    ```bash
    expo start
    ```

4. **Uruchom na emulatorze Androida**:
   Aby uruchomić aplikację na emulatorze Androida, wykonaj:

    ```bash
    expo start --android
    ```

5. **Uruchom na urządzeniu fizycznym**:
   Zeskanuj kod QR za pomocą aplikacji Expo Go na swoim urządzeniu Android lub iOS, aby uruchomić aplikację.

### Konfiguracja

#### Tryb ciemny

Możesz przełączać tryb ciemny w nagłówku aplikacji, a cała aplikacja zmieni wygląd na ciemniejszy, co jest bardziej wygodne do użytku w nocy.

#### Termin zadania

Każde zadanie może mieć przypisany termin, a aplikacja pozwala na sortowanie zadań według daty terminu.

## Technologie użyte w projekcie

-   **React Native**: Framework JavaScript do budowania aplikacji mobilnych.
-   **Expo**: Platforma open-source do uniwersalnych aplikacji React.
-   **React Navigation**: Do nawigacji między ekranami w aplikacji.
-   **AsyncStorage**: Do przechowywania danych zadania lokalnie na urządzeniu.

## Członkowie zespołu

-   **Hubert Parylak** - Nr albumu: 71519
-   **Kacper Gasiul** - Nr albumu: 81550
-   **Tomasz Zańko** - Nr albumu: 68356
-   **Łukasz Jarębski** - Nr albumu: 67530

## Licencja

Ten projekt jest licencjonowany na podstawie licencji MIT.
