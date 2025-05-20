Feature: User Login
  Sebagai pengguna Talent Pool
  Saya ingin melakukan login ke aplikasi
  Agar saya dapat mengakses fitur-fitur yang memerlukan autentikasi

  Scenario: Login berhasil dengan kredensial valid
    Given saya berada di halaman login
    When saya memasukkan email "user@example.com"
    And saya memasukkan password "password123"
    And saya mengklik tombol login
    Then saya harus diarahkan ke halaman dashboard
    And saya melihat pesan "Login berhasil"

  Scenario: Login gagal dengan email tidak valid
    Given saya berada di halaman login
    When saya memasukkan email "a"
    And saya memasukkan password "password123"
    And saya mengklik tombol login
    Then saya tetap berada di halaman login
    And saya melihat pesan error "Email yang dimasukkan tidak valid"

  Scenario: Login gagal dengan password terlalu pendek
    Given saya berada di halaman login
    When saya memasukkan email "user@example.com"
    And saya memasukkan password "short"
    And saya mengklik tombol login
    Then saya tetap berada di halaman login
    And saya melihat pesan error "Kata sandi harus memiliki setidaknya 8 karakter"

  Scenario: Login gagal dengan kredensial yang salah
    Given saya berada di halaman login
    When saya memasukkan email "user@example.com"
    And saya memasukkan password "wrongpassword"
    And saya mengklik tombol login
    Then saya tetap berada di halaman login
    And saya melihat pesan error "Email atau password salah"