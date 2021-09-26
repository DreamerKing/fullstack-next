import { Box } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import {
  useDeletePostMutation,
  useMeQuery,
  // useUpdatePostMutation,
} from "src/generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}
const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  // const [, updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const { data: meData } = useMeQuery();
  if (meData?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <EditIcon mr={4} icon="edit" color="green" aria-label="edit Post" />
      </NextLink>
      <DeleteIcon
        icon="delete"
        color="red"
        aria-label="Delete Post"
        onClick={() => {
          deletePost({
            variables: { id },
            update: (cache) => {
              cache.evict({ id: "Post:" + id });
            },
          });
        }}
      />
    </Box>
  );
};

export default EditDeletePostButtons;
