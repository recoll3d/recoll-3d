import { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useForm } from "react-hook-form";
// import KeyboardedInput from "react-touch-screen-keyboard";
// import "react-touch-screen-keyboard/lib/Keyboard.css";
import Keyboard from "react-virtual-keyboard";

import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { Loading } from "../../components/Loading";

import "./styles.css";

import logo from "../../assets/logo-name.svg";

// array ou objeto: manualmente informar o tipo da variavel

interface Profile {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

const Signup = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const navigate = useNavigate();
  const inputRef = useRef(null);

  const { register, handleSubmit } = useForm();
  const { signIn } = useContext(AuthContext);

  useEffect(() => {
    api
      .get("/profiles")
      .then((response) => {
        setTimeout(() => {
          setProfiles(response.data);
        }, 2000);
      })
      .catch((err) => {
        setProfiles([]);
        console.log(err);
      });
  }, []);

  function handleNavigateToHome(event: any) {
    event.preventDefault();
    navigate(-1);
  }

  async function handleSignUp(data: any) {
    const newData = {
      ...data,
      profile_id: selectedProfiles[0],
    };
    await api.post("/users", newData);

    const { email, username, password } = data;

    await signIn({ email, username, password });
  }

  function handleSelectProfile(id: number) {
    const alreadySelected = selectedProfiles.findIndex(
      (profile) => profile === id
    );

    if (alreadySelected >= 0) {
      const filteredProfiles = selectedProfiles.filter(
        (profile) => profile !== id
      );

      setSelectedProfiles(filteredProfiles);
    } else {
      setSelectedProfiles([id]);
    }
  }

  if (!profiles.length) {
    return <Loading />;
  }

  return (
    <div id="page-signup">
      <header role="header">
        <div>
          <img src={logo} alt="Recoll3D" />
        </div>

        <Link to=".." onClick={handleNavigateToHome}>
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit(handleSignUp)}>
        <header role="title">
          <h2>Seu Cadastro</h2>
        </header>

        <fieldset>
          <header role="legend">
            <h2>Dados</h2>
          </header>

          {/* <KeyboardedInput
            {...register("first-name")}
            enabled
            required
            // value={inputValue}
            // onChange={handleInputChange}
            placeholder="Digite aqui..."
          /> */}

          <div className="field">
            <label htmlFor="name">Nome</label>
            <input
              {...register("name")}
              type="text"
              name="name"
              id="name"
              autoFocus
              // ref={inputRef}
              // inputMode="text"
              // onFocus={() => Keyboard.call}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                {...register("email")}
                type="email"
                name="email"
                id="email"
              />
            </div>
            <div className="field">
              <label htmlFor="username">Apelido Gamer</label>
              <input
                {...register("username")}
                type="text"
                name="username"
                id="username"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              {...register("password")}
              type="password"
              name="password"
              id="password"
            />
          </div>
        </fieldset>

        <fieldset>
          <header role="legend">
            <h2>Perfil</h2>
            <span>Selecione seu perfil de jogador abaixo</span>
          </header>

          <ul className="profiles-grid">
            {profiles.map((profile) => (
              <li
                key={profile.id}
                onClick={() => handleSelectProfile(profile.id)}
                className={
                  selectedProfiles.includes(profile.id) ? "selected" : ""
                }
              >
                <img src={profile.image_url} alt={profile.name} />
                <span>{profile.name}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Iniciar jornada</button>
      </form>
    </div>
  );
};

export default Signup;
