"""Activations visualizations"""
from typing import List, Union, Optional

import numpy as np
import torch
from circuitsvis.utils.render import RenderedHTML, render


def token_activations(
    tokens: List[str],
    activations: Union[np.ndarray, torch.Tensor, List[np.ndarray], List[torch.Tensor]],
) -> RenderedHTML:
    """Show activations (colored by intensity) for each token in a text or set
    of texts.

    Includes drop-downs for layer and neuron numbers.

    Args:
        tokens: List of tokens (e.g. `["A", "person"]`)
        activations: Activations of the shape [tokens x tokens]

    Returns:
        Html: Text token attribution visualization
    """
    # Verify that activations and tokens have the right shape and convert to
    # nested lists
    if isinstance(activations, (np.ndarray, torch.Tensor)):
        assert (
            activations.ndim == 2
        ), "activations must be of shape [tokens x tokens]"
        activations_list = activations.tolist()
    elif isinstance(activations, list):
        activations_list = []
        for act in activations:
            assert (
                act.ndim == 2
            ), "activations must be of shape [tokens x tokens]"
            activations_list.append(act.tolist())
    else:
        raise TypeError(
            f"activations must be of type np.ndarray, torch.Tensor, or list, not {type(activations)}"
        )

    return render(
        "TokenAttribution",
        tokens=tokens,
        activations=activations_list,
    )


def stacked_token_activations(
    tokens: List[str],
    activations: Union[np.ndarray, torch.Tensor, List[np.ndarray], List[torch.Tensor]],
) -> RenderedHTML:
    """Show activations (colored by intensity) for each token in a text or set
    of texts.

    Includes drop-downs for layer and neuron numbers.

    Args:
        tokens: List of tokens (e.g. `["A", "person"]`)
        activations: Activations of the shape [tokens x tokens]

    Returns:
        Html: Text token attribution visualization
    """
    # Verify that activations and tokens have the right shape and convert to
    # nested lists
    if isinstance(activations, (np.ndarray, torch.Tensor)):
        assert (
            activations.ndim == 3
        ), "activations must be of shape [num_generated_tokens x tokens x tokens]"
        activations_list = activations.tolist()
    elif isinstance(activations, list):
        activations_list = []
        for act in activations:
            assert (
                act.ndim == 2
            ), "activations must be of shape [tokens x tokens]"
            activations_list.append(act.tolist())
    else:
        raise TypeError(
            f"activations must be of type np.ndarray, torch.Tensor, or list, not {type(activations)}"
        )

    return render(
        "StackedTokenAttribution",
        tokens=tokens,
        activations=activations_list,
    )
