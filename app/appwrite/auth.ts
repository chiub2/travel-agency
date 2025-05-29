import { ID, OAuthProvider, Query } from "appwrite";
import { account, database, appwriteConfig } from "~/appwrite/client";
import { redirect } from "react-router";

export const getExistingUser = async (id: string) => {
    try {
        const { documents, total } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", id)]
        );
        return total > 0 ? documents[0] : null;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

export const storeUserData = async () => {
    try {
        const user = await account.get();
        if (!user) throw new Error("User not found");

        const { providerAccessToken } = (await account.getSession("current")) || {};
        const profilePicture = providerAccessToken
            ? await getGooglePicture(providerAccessToken)
            : null;

        const createdUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: user.$id,
                email: user.email,
                name: user.name,
                imageUrl: profilePicture,
                joinedAt: new Date().toISOString(),
            }
        );

        if (!createdUser.$id) redirect("/sign-in");
    } catch (error) {
        console.error("Error storing user data:", error);
    }
};

const getGooglePicture = async (accessToken: string) => {
    try {
        const response = await fetch(
            "https://people.googleapis.com/v1/people/me?personFields=photos",
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!response.ok) throw new Error("Failed to fetch Google profile picture");

        const { photos } = await response.json();
        return photos?.[0]?.url || null;
    } catch (error) {
        console.error("Error fetching Google picture:", error);
        return null;
    }
};

export const loginWithGoogle = async () => {
    try {
        // Clear any existing OAuth state
        localStorage.removeItem('oauth_state');
        sessionStorage.clear();

        // Create new OAuth2 session
        await account.createOAuth2Session(
            OAuthProvider.Google,
            `${window.location.origin}/`,
            `${window.location.origin}/sign-in`
        );
    } catch (error) {
        console.error("Error during OAuth2 session creation:", error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        // Delete all sessions
        const sessions = await account.listSessions();
        for (const session of sessions.sessions) {
            await account.deleteSession(session.$id);
        }
        
        // Clear any stored OAuth state
        localStorage.removeItem('oauth_state');
        sessionStorage.clear();
        
        // Redirect to sign-in page
        window.location.href = '/sign-in';
    } catch (error) {
        console.error("Error during logout:", error);
        // Force redirect even if there's an error
        window.location.href = '/sign-in';
    }
};

export const getUser = async () => {
  try {
      const user = await account.get();
      if (!user || !user.$id) return redirect("/sign-in"); // Not logged in

      const { documents } = await database.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          [
              Query.equal("accountId", user.$id),
              Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]),
          ]
      );

      if (documents.length === 0) {
          // User is logged in but not authorized (not in your DB collection)
          return redirect("/");
      }

      // Logged in and authorized
      return documents[0];
  } catch (error) {
      console.error("Error fetching user:", error);
      return redirect("/sign-in"); // Catch-all fallback for unexpected errors
  }
};


export const getAllUsers = async (limit: number, offset: number) => {
    try {
        const { documents: users, total } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.limit(limit), Query.offset(offset)]
        )

        if(total === 0) return { users: [], total };

        return { users, total };
    } catch (e) {
        console.log('Error fetching users')
        return { users: [], total: 0 }
    }
}