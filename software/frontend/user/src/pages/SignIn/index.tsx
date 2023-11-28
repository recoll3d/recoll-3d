import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useForm } from "react-hook-form";

import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { Loading } from "../../components/Loading";

import "./styles.css";

import logo from "../../assets/logo.svg";

// array ou objeto: manualmente informar o tipo da variavel

interface Profile {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

const SignIn = () => {
  const [loaded, setLoaded] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);

  const { register, handleSubmit } = useForm();
  const { signIn } = useContext(AuthContext);

  const navigate = useNavigate();
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   whatsapp: "",
  // });

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 3000);
  }, []);

  async function handleSignIn(data: any) {
    const dataLogin = await signIn(data);

    console.log(dataLogin);
  }

  // function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
  //   const { name, value } = event.target;

  //   setFormData({ ...formData, [name]: value });
  // }

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

  // async function handleSubmit(event: FormEvent) {
  //   event.preventDefault();

  //   const { name, email, whatsapp } = formData;
  //   const profiles = selectedProfiles;

  //   // const data = new FormData();

  //   // data.append('name', name);
  //   // data.append('email', email);
  //   // data.append('whatsapp', whatsapp);
  //   // data.append('profile', profiles.join(''));

  //   const data = {
  //     name,
  //     email,
  //     whatsapp,
  //     profile: profiles.join(""),
  //   };

  //   // await api.post('user', data);
  //   console.log(data);
  //   alert("Ponto de coleta criado!");

  //   // navigate('/');
  // }

  function handleNavigateToHome(event: any) {
    event.preventDefault();
    navigate(-1);
  }

  if (!loaded) {
    return <Loading />;
  }

  return (
    <div id="page-signin">
      <header role="header">
        <div>
          <img src={logo} alt="Recoll3D" />
        </div>

        <Link to=".." onClick={handleNavigateToHome}>
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit(handleSignIn)}>
        <header role="title">
          <h2>Seu Login</h2>
        </header>

        <fieldset>
          <header role="legend">
            <h2>Dados</h2>
          </header>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              {...register("email")}
              type="email"
              name="email"
              id="email"
              autoFocus
              // onChange={handleInputChange}
            />
          </div>

          {/* <div className="field-group">
            <div className="field">
              <label htmlFor="username">Apelido Player</label>
              <input
                {...register("username")}
                type="text"
                name="username"
                id="username"
                // onChange={handleInputChange}
              />
            </div>
          </div> */}

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              {...register("password")}
              type="password"
              name="password"
              id="password"
              // autoFocus
              // onChange={handleInputChange}
            />
          </div>
        </fieldset>

        <button type="submit">Continuar</button>
      </form>
    </div>
  );
};

export default SignIn;
