import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

beforeEach(() => {
  render(<IletisimFormu />);
});

test("hata olmadan render ediliyor", () => {
  expect(screen.getByText("İletişim Formu")).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
});

test("iletişim formu headerı render ediliyor", () => {
  expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  const adInput = screen.getByLabelText("Ad*");
  userEvent.type(adInput, "test");
  await waitFor(() => {
    const errors = screen.getAllByTestId("error");
    expect(errors).toHaveLength(1);

    expect(
      screen.getByText(/Ad en az 5 karakter olmalıdır./i)
    ).toBeInTheDocument();
  });
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  const submitBtn = screen.getByRole("button", { name: /Gönder/i });
  userEvent.click(submitBtn);

  await waitFor(() => {
    const errors = screen.getAllByTestId("error");
    expect(errors).toHaveLength(3);
  });
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  const adInput = screen.getByLabelText("Ad*");
  userEvent.type(adInput, "testt");

  const soyadInput = screen.getByPlaceholderText("Mansız");
  userEvent.type(soyadInput, "t");

  const submitBtn = screen.getByRole("button", { name: /Gönder/i });
  userEvent.click(submitBtn);

  await waitFor(() => {
    const errors = screen.getAllByTestId("error");
    expect(errors).toHaveLength(1);
  });
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  const emailInput = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  userEvent.type(emailInput, "abcde.com");

  const msgEmailError = new RegExp(
    "email geçerli bir email adresi olmalıdır",
    "i"
  );
  await waitFor(() => {
    expect(screen.getByText(msgEmailError)).toBeInTheDocument();
  });
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  const submitBtn = screen.getByRole("button", { name: /Gönder/i });
  userEvent.click(submitBtn);

  const soyadError = new RegExp("soyad gereklidir.", "i");
  await waitFor(() => {
    expect(screen.getByText(soyadError)).toBeInTheDocument();
  });

  const soyadInput = screen.getByPlaceholderText("Mansız");
  userEvent.type(soyadInput, "t");

  await waitFor(() => {
    const errors = screen.getAllByTestId("error");
    expect(errors).toHaveLength(2);
  });
});
test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  const adInput = screen.getByLabelText("Ad*");
  userEvent.type(adInput, "testt");

  const soyadInput = screen.getByPlaceholderText("Mansız");
  userEvent.type(soyadInput, "t");

  const emailInput = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  userEvent.type(emailInput, "abcde@abcde.com");

  const submitBtn = screen.getByRole("button", { name: /Gönder/i });
  userEvent.click(submitBtn);

  await waitFor(() => {
    expect(screen.queryAllByTestId("error")).toHaveLength(0);
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  const adInput = screen.getByLabelText("Ad*");
  userEvent.type(adInput, "testt");

  const soyadInput = screen.getByPlaceholderText("Mansız");
  userEvent.type(soyadInput, "t");

  const emailInput = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  userEvent.type(emailInput, "abcde@abcde.com");

  const mesajInput = screen.getByLabelText("Mesaj");
  userEvent.type(mesajInput, "emre");

  const formElement = screen.getByTestId("form");

  await waitFor(() => {
    expect(formElement).toHaveFormValues({
      ad: "testt",
      soyad: "t",
      email: "abcde@abcde.com",
      mesaj: "emre",
    });
  });
});
