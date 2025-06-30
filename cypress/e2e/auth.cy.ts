describe('Authentication', () => {
  const accounts = [
    { email: 'S22310310@student.unklab.ac.id', pass: '12345678', shouldSucceed: true, role: 'pembeli' },
    { email: 'kyranruntukahu38@gmail.com', pass: '12345678', shouldSucceed: true, role: 'petani' },
    { email: 's22110342@student.unklab.ac.id', pass: 'Marions314', shouldSucceed: true, role: 'admin' },
    { email: 'wrong@test.com', pass: 'wrongpass', shouldSucceed: false, role: 'invalid' }
  ];

  accounts.forEach(account => {
    it(`should ${account.shouldSucceed ? 'succeed' : 'fail'} for ${account.role} account`, () => {
      // Kunjungi halaman login
      cy.visit('http://localhost:8084/auth');

      // Cari input email dan ketik email
      cy.get('input[name="email"]').type(account.email);

      // Cari input password dan ketik password
      cy.get('input[name="password"]').type(account.pass);

      // Klik tombol login
      cy.get('button[type="submit"]').contains('Login').click();

      if (account.shouldSucceed) {
        // Jika login berhasil, verifikasi URL mengarah ke dashboard yang sesuai
        let expectedPath = '/';
        if (account.role === 'admin') expectedPath = '/admin-dashboard';
        if (account.role === 'petani') expectedPath = '/farmer-dashboard';
        if (account.role === 'pembeli') expectedPath = '/buyer-dashboard';
        
        cy.url().should('include', expectedPath, { timeout: 10000 });
        cy.log(`Login successful for ${account.role}`);
      } else {
        // Jika login gagal, verifikasi pesan error muncul
        cy.contains(/login failed|invalid credentials/i).should('be.visible');
        cy.log('Login failed as expected for invalid credentials');
      }
    });
  });
}); 