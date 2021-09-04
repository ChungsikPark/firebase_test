import styled from '@emotion/styled'
import firebase from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

const Wrapper = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-Items: center;
width: 100vw;
height: 100vh;
grid-gap: 8;
background: linear-gradient(180deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%);
`

export default function Home() {
  const db = firebase.firestore();
  const [user, loading, error] = useAuthState(firebase.auth());
  console.log("Loading:", loading, "|", "Current user:", user);
  const [votes, votesLoading, votesError] = useCollection(
    firebase.firestore().collection("votes"),
    {}
  );
  if (!votesLoading && votes) {
    votes.docs.map((doc) => console.log(doc.data()));
  }

  const addVoteDocument = async (vote: string) => {
    await db.collection("votes").doc(user.uid).set({
      vote,
    });
  };

  return (
    <Wrapper>
      <h1>Pineapple on Pizza?</h1>

      <div style={{ flexDirection: "row", display: "flex" }}>
        <button
          style={{ fontSize: 32, marginRight: 8 }}
          onClick={() => addVoteDocument("yes")}
        >
          ✔️🍍🍕
        </button>
        <h3>
          Pineapple Lovers:{" "}
          {
            votes?.docs?.filter(
              (doc) => doc.data().vote === "yes"
            ).length
          }
        </h3>
      </div>
      <div style={{ flexDirection: "row", display: "flex" }}>
        <button
          style={{ fontSize: 32, marginRight: 8 }}
          onClick={() => addVoteDocument("no")}
        >
          ❌🍍🍕
        </button>
        <h3>
          Pineapple Haters:{" "}
          {
            votes?.docs?.filter(
              (doc) => doc.data().vote === "no"
            ).length
          }
        </h3>
      </div>
      <button>Sign Out</button>
    </Wrapper>
  )
}
